import type { UserRequest } from "@stream-io/node-sdk";
import { error, json, type RequestHandler } from "@sveltejs/kit";

import {client} from "$api/global"
import { requiresLoggedInUser } from "$api/middleware";
import { db } from "$/lib/server/db";
import {user as userDb} from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = requiresLoggedInUser(async (event, user) => {
    let members = await db.select({
        canSell: userDb.canSell,
    })
        .from(userDb)
        .where(eq(userDb.id, user.id))
        .limit(1);

    if (members.length === 0) {
        await db.insert(userDb)
            .values({id: user.id});

        members = await db.select({
            canSell: userDb.canSell,
        })
            .from(userDb)
            .where(eq(userDb.id, user.id))
            .limit(1);
    }

    const userName = user.id;

    const streamioUser: UserRequest = {
        id: user.id,
        role: "user",
        name: userName,
    }; 

    await client.upsertUsers([streamioUser]);

    const streamioUserToken = client.generateUserToken({user_id: user.id});

    return json({
        userId: user.id,
        userName,
        streamioUserToken,
        canSell: members[0].canSell,
    });
});