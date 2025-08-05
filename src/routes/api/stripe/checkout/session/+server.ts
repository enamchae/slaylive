import { error } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";

import { stripe } from "$/lib/server/stripe";
import { db } from "$/lib/server/db";
import { listingTable, streamListingAssociationTable, userTable } from "$/lib/server/db/schema";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";

const endpoint = new PostEndpoint(
    async (
        payload: {
            listingId: string,
            streamId: string,
            successUrl: string,
            cancelUrl: string,
        },
        { user }: { user: User }
    ) => {
        // Get listing details
        const listingData = await db.select({
                listing: {
                    id: listingTable.id,
                    title: listingTable.title,
                    description: listingTable.description,
                    sellerUserId: listingTable.sellerUserId,
                },
                association: {
                    price: streamListingAssociationTable.price,
                    active: streamListingAssociationTable.active,
                },
                seller: {
                    name: userTable.name,
                },
            })
            .from(listingTable)
            .innerJoin(
                streamListingAssociationTable,
                and(
                    eq(streamListingAssociationTable.listingId, listingTable.id),
                    eq(streamListingAssociationTable.streamId, payload.streamId)
                )
            )
            .innerJoin(userTable, eq(userTable.id, listingTable.sellerUserId))
            .where(eq(listingTable.id, payload.listingId))
            .limit(1);

        if (listingData.length === 0) {
            return error(404, "Listing not found or not available in this stream");
        }

        const { listing, association, seller } = listingData[0];

        if (!association.active) {
            return error(400, "Listing is not currently active");
        }

        if (listing.sellerUserId === user.id) {
            return error(400, "Cannot purchase your own listing");
        }

        const amountInCents = Math.round(parseFloat(association.price) * 100);

        if (amountInCents <= 0) {
            return error(400, "Invalid listing price");
        }

        // Get user's Stripe customer ID
        const userDatas = await db.select({stripeCustomerId: userTable.stripeCustomerId})
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);
        
        if (userDatas.length === 0) return error(500, "No user with this id");

        const userData = userDatas[0];
        
        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: listing.title,
                            description: listing.description || undefined,
                            metadata: {
                                listingId: listing.id,
                                streamId: payload.streamId,
                            },
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer: userData.stripeCustomerId || undefined,
            customer_email: userData.stripeCustomerId ? undefined : user.email,
            metadata: {
                listingId: payload.listingId,
                streamId: payload.streamId,
                buyerUserId: user.id,
                sellerUserId: listing.sellerUserId,
                sellerName: seller.name || 'Unknown Seller',
            },
            ui_mode: 'embedded',
            return_url: payload.successUrl,
        });

        if (!session.client_secret) {
            return error(500, "Failed to create checkout session");
        }

        return {
            sessionId: session.id,
            clientSecret: session.client_secret,
            url: session.url,
        };
    }
);

export const POST = requiresLoggedInUser(async (user, event) => 
    endpoint.callHandler({ user }, event)
);

export type CreateCheckoutSession = typeof endpoint; 