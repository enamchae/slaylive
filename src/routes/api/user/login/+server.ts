import type { UserRequest } from "@stream-io/node-sdk";
import { error, json, type RequestHandler } from "@sveltejs/kit";

import {streamio} from "$api/global"
import { PostEndpoint, requiresLoggedInUser } from "$api/middleware";
import { db } from "$/lib/server/db";
import {userTable} from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";


const post = new PostEndpoint(
    () => ({}),

    async (payload, {user}: {user: User}) => {
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

        return {
            userId: user.id,
            userName,
            streamioUserToken,
            canSell: members[0].canSell,
        };
    },
);


export const POST: RequestHandler = requiresLoggedInUser(async (user, event) => post.callHandler({user}, event));
export type Endpoint = typeof post;