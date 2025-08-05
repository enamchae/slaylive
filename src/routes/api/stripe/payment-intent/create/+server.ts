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
        },
        { user }: { user: User }
    ) => {
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

        const userDatas = await db.select({stripeCustomerId: userTable.stripeCustomerId})
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);
        if (userDatas.length === 0) return error(500, "No user with this id");

        const userData = userDatas[0];
        if (userData.stripeCustomerId === null) return error(403, "User has no customer id");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            customer: userData.stripeCustomerId,
            metadata: {
                listingId: payload.listingId,
                streamId: payload.streamId,
                buyerUserId: user.id,
                sellerUserId: listing.sellerUserId,
                sellerName: seller.name || 'Unknown Seller',
            },
            description: `Purchase: ${listing.title} from ${seller.name || 'Unknown Seller'}`,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        if (paymentIntent.client_secret === null) return error(500, "Payment intent has a null client secret");

    
        const ephemeralKey = await stripe.ephemeralKeys.create({
            customer: userData.stripeCustomerId,
        }, {
            apiVersion: "2025-05-28.basil",
        });
        if (ephemeralKey.secret === undefined) return error(500, "No emphemeral key was generated");

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amountInCents,
            currency: 'usd',
            ephemeralKey: ephemeralKey.secret,
            customerId: userData.stripeCustomerId,
            listing: {
                id: listing.id,
                title: listing.title,
                description: listing.description,
                price: association.price,
            },
            seller: {
                name: seller.name,
            },
        };
    }
);

export const POST = requiresLoggedInUser(async (user, event) => 
    endpoint.callHandler({ user }, event)
);

export type CreatePaymentIntent = typeof endpoint;
