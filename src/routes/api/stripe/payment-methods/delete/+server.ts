import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";

import { stripe } from "$/lib/server/stripe";
import { db } from "$/lib/server/db";
import { userTable } from "$/lib/server/db/schema";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";

const endpoint = new PostEndpoint(
    async (
        payload: {
            paymentMethodId: string;
        },
        { user }: { user: User }
    ) => {
        try {
            // Get user's Stripe customer ID to verify ownership
            const userData = await db
                .select({ stripeCustomerId: userTable.stripeCustomerId })
                .from(userTable)
                .where(eq(userTable.id, user.id))
                .limit(1);

            if (userData.length === 0 || !userData[0].stripeCustomerId) {
                return error(404, "Customer not found");
            }

            // Get the payment method to verify it belongs to this customer
            const paymentMethod = await stripe.paymentMethods.retrieve(payload.paymentMethodId);
            
            if (paymentMethod.customer !== userData[0].stripeCustomerId) {
                return error(403, "Payment method does not belong to this customer");
            }

            // Detach the payment method
            await stripe.paymentMethods.detach(payload.paymentMethodId);

            return { success: true };
        } catch (stripeError) {
            console.error('Failed to delete payment method:', stripeError);
            return error(500, "Failed to delete payment method");
        }
    }
);

export const DELETE = requiresLoggedInUser(async (user, event) => 
    endpoint.callHandler({ user }, event)
);

export type DeletePaymentMethod = typeof endpoint;
