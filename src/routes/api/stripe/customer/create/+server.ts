import { error } from "@sveltejs/kit";
import type { User } from "@supabase/supabase-js";

import { stripe } from "$/lib/server/stripe";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";
import { db } from "$/lib/server/db";
import { userTable } from "$/lib/server/db/schema";
import { eq } from "drizzle-orm";

const endpoint = new PostEndpoint(
    async ({}, { user }: { user: User }) => {
        try {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            });

            await db.update(userTable)
                .set({stripeCustomerId: customer.id})
                .where(eq(userTable.id, user.id));

            return {
                customerId: customer.id,
                email: customer.email,
                name: customer.name,
            };
        } catch (stripeError) {
            console.error('Stripe customer creation failed:', stripeError);
            return error(500, "Failed to create customer");
        }
    }
);

export const POST = requiresLoggedInUser(async (user, event) => 
    endpoint.callHandler({ user }, event)
);

export type CreateCustomer = typeof endpoint;
