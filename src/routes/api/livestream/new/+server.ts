import {error} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";

import { listingTable, streamTable, streamListingAssociationTable, userTable as userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { PostEndpoint, requiresLoggedInUser } from "../../middleware";
import { validate } from "$lib/validation";
import { streamio } from "../../global";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (
        payload: {
            livestreamTitle: string,
            livestreamDescription: string,
            livestreamListingIds?: string[],
        },
        {user}: {user: User},
    ) => {
        const userObjs = await db.select({canSell: userTable.canSell, id: userTable.id})
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);

        if (userObjs.length === 0) return error(500, "User not found");

        const userObj = userObjs[0];
        if (!userObj.canSell) return error(403, "User is not a seller");

        const livestreamId = await generateLivestreamId();

        const call = streamio.video.call("livestream", livestreamId);

        // Create the call and insert the stream record
        await Promise.all([
            call.create({
                data: {
                    created_by_id: user.id,
                    members: [
                        {user_id:  user.id, role: "user"},
                    ],
                },
            }),

            db.insert(streamTable)
                .values({
                    id: livestreamId,
                    hostUserId: user.id,
                    title: payload.livestreamTitle,
                    description: payload.livestreamDescription,
                }),
        ]);

        // Add listing associations if provided
        if (payload.livestreamListingIds && payload.livestreamListingIds.length > 0) {
            await db.insert(streamListingAssociationTable)
                .values(payload.livestreamListingIds.map(listingId => ({
                    listingId,
                    streamId: livestreamId,
                })));
        }

        return {livestreamId};
    },
);

export const PUT = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type NewLivestream = typeof endpoint;


const generateLivestreamId = async () => {
    let id: string;
    while (true) {
        id = crypto.randomUUID();

        const calls = await db.select({})
            .from(streamTable)
            .where(eq(streamTable.id, id))
            .limit(1);
        if (calls.length === 0) break;
    }

    return id;
};