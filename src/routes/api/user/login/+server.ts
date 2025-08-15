import type { UserRequest } from "@stream-io/node-sdk";
import { error, json, type RequestHandler } from "@sveltejs/kit";

import {streamio} from "$api/global"
import { PostEndpoint, requiresLoggedInUser } from "$api/middleware";
import { db } from "$/lib/server/db";
import {userTable} from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import { hasFinishedProfileSetup } from "$/lib/shared/user-utils";


const post = new PostEndpoint(
    async (payload, {user}: {user: User}) => {
        let members = await db.select({
            canSell: userTable.canSell,
            name: userTable.name,
            stripeCustomerId: userTable.stripeCustomerId,
        })
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);

        if (members.length === 0) {
            members = await db.insert(userTable)
                .values({
                    id: user.id,
                    name: null,
                })
                .returning({
                    canSell: userTable.canSell,
                    name: userTable.name,
                    stripeCustomerId: userTable.stripeCustomerId,
                });
        }


        const member = members[0];

        const streamioUser: UserRequest = {
            id: user.id,
            role: "user",
            name: member.name,
        }; 

        await streamio.upsertUsers([streamioUser]);

        const streamioUserToken = streamio.generateUserToken({user_id: user.id});

        return {
            userId: user.id,
            userName: member.name,
            streamioUserToken,
            canSell: member.canSell,
            hasFinishedProfileSetup: hasFinishedProfileSetup(member),
        };
    },
);


export const POST = requiresLoggedInUser(async (user, event) => post.callHandler({user}, event));
export type UserLogin = typeof post;