import type { UserRequest } from "@stream-io/node-sdk";
import { error, json, type RequestHandler } from "@sveltejs/kit";

import {streamio} from "$api/global"
import { requiresLoggedInUser } from "$api/middleware";
import { db } from "$/lib/server/db";
import {userTable} from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = requiresLoggedInUser(async (user, event) => {
    let members = await db.select({
        canSell: userTable.canSell,
    })
        .from(userTable)
        .where(eq(userTable.id, user.id))
        .limit(1);

    if (members.length === 0) {
        await db.insert(userTable)
            .values({
                id: user.id,
                name: "",
            });

        members = await db.select({
            canSell: userTable.canSell,
        })
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);
    }

    const userName = user.id;

    const streamioUser: UserRequest = {
        id: user.id,
        role: "user",
        name: userName,
    }; 

    await streamio.upsertUsers([streamioUser]);

    const streamioUserToken = streamio.generateUserToken({user_id: user.id});

    return json({
        userId: user.id,
        userName,
        streamioUserToken,
        canSell: members[0].canSell,
    });
});