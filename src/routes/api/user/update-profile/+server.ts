import type { UserRequest } from "@stream-io/node-sdk";
import { error, json, type RequestHandler } from "@sveltejs/kit";

import { streamio } from "$api/global";
import { PostEndpoint, requiresLoggedInUser } from "$api/middleware";
import { db } from "$/lib/server/db";
import { userTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import { validate } from "$lib/validation";
import { post } from "$api/endpoint-server";

const endpoint = post(
    async (
        payload: {
            name: string;
        },
        { user }: { user: User }
    ) => {
        const validationResult = validate.username({ name: payload.name });
        if (!validationResult.ok) {
            return error(400, JSON.stringify({ errors: validationResult.errors }));
        }

        const existingUsers = await db.select({
            id: userTable.id,
            name: userTable.name,
            finishedProfileSetup: userTable.finishedProfileSetup,
        })
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);

        if (existingUsers.length === 0) {
            return error(404, "User not found");
        }

        await db.update(userTable)
            .set({
                name: payload.name,
                finishedProfileSetup: true,
            })
            .where(eq(userTable.id, user.id));

        const streamioUser: UserRequest = {
            id: user.id,
            role: "user",
            name: payload.name,
        };

        await streamio.upsertUsers([streamioUser]);

        return {
            success: true,
            name: payload.name,
            finishedProfileSetup: true,
        };
    }
);

export const POST = requiresLoggedInUser(async (user, event) => endpoint.callHandler({ user }, event));
export type UpdateProfile = typeof endpoint;
