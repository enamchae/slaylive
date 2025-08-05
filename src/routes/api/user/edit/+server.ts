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


const endpoint = post(async (
    {
        name,
    }: {
        name?: string;
    },
    { user }: { user: User }
) => {
    if (name !== undefined) {
        const validationResult = validate.username({ name });
        if (!validationResult.ok) {
            return error(400, JSON.stringify({ errors: validationResult.errors }));
        }
    }

    const updatedUsers = await db.update(userTable)
        .set({
            name,
            finishedProfileSetup: true,
        })
        .where(eq(userTable.id, user.id))
        .returning();

    if (updatedUsers.length === 0) return error(500, "No user");

    if (name !== undefined) {
        const streamioUser: UserRequest = {
            id: user.id,
            role: "user",
            name,
        };

        await streamio.upsertUsers([streamioUser]);
    }

    return {};
});

export const POST = requiresLoggedInUser(async (user, event) => endpoint.callHandler({ user }, event));
export type UserEdit = typeof endpoint;
