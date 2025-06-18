import {error, json, type RequestHandler} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";

import { listingTable, streamTable, streamListingAssociationTable, userTable as userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";
import { validate } from "$lib/validation";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (
        {streamId, listingIds}: {
            streamId: string,
            listingIds: string[],
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

        const livestreamObjs = await db.select({hostUserId: streamTable.hostUserId})
            .from(streamTable)
            .where(eq(streamTable.id, streamId))
            .limit(1);
        if (livestreamObjs.length === 0) return error(404, "Livestream not found");
        
        const livestreamObj = livestreamObjs[0];
        if (livestreamObj.hostUserId !== userObj.id) return error(403, "User is not the host of this livestream");



        await db.delete(streamListingAssociationTable)
            .where(eq(streamListingAssociationTable.streamId, streamId));
        
        if (listingIds.length > 0) {
            await db.insert(streamListingAssociationTable)
                .values(listingIds.map(listingId => ({
                    listingId,
                    streamId,
                })));
        }

        return {};
    },
);

export const PATCH = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type EditStreamListingSelection = typeof endpoint;
