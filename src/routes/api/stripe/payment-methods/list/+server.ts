import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";

import { stripe } from "$/lib/server/stripe";
import { db } from "$/lib/server/db";
import { userTable } from "$/lib/server/db/schema";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";

const endpoint = new PostEndpoint(
    async (payload: {}, { user }: { user: User }) => {
        try {
            // Get user's Stripe customer ID
            const userData = await db
                .select({ stripeCustomerId: userTable.stripeCustomerId })
                .from(userTable)
                .where(eq(userTable.id, user.id))
                .limit(1);

            if (userData.length === 0 || !userData[0].stripeCustomerId) {
                return { paymentMethods: [] };
            }

            // Get payment methods from Stripe
            const paymentMethods = await stripe.paymentMethods.list({
                customer: userData[0].stripeCustomerId,
                type: 'card',
            });

            return {
                paymentMethods: paymentMethods.data.map(pm => ({
                    id: pm.id,
                    type: pm.type,
                    card: pm.card ? {
                        brand: pm.card.brand,
                        last4: pm.card.last4,
                        exp_month: pm.card.exp_month,
                        exp_year: pm.card.exp_year,
                    } : null,
                })),
            };
        } catch (stripeError) {
            console.error('Failed to list payment methods:', stripeError);
            return error(500, "Failed to retrieve payment methods");
        }
    }
);

export const POST = requiresLoggedInUser(async (user, event) =>
    endpoint.callHandler({ user }, event)
);

export type ListPaymentMethods = typeof endpoint;
