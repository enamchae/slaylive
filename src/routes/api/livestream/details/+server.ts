import { db } from "$/lib/server/db";
import { streamTable, streamListingAssociationTable, listingTable } from "$/lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    async (payload: {
        streamId: string,
    }) => {
        // if (livestreamId === null) return error(400, "Missing livestream id");

        const livestreams = await db.select({
            id: streamTable.id,
            title: streamTable.title,
            description: streamTable.description,
            hostUserId: streamTable.hostUserId,
            active: streamTable.active,
        })
            .from(streamTable)
            .where(eq(streamTable.id, payload.streamId))
            .limit(1);

        if (livestreams.length === 0) return error(404, "No livestream found");

        const livestreamObj = livestreams[0];


        const listings = await db.select({
            id: streamListingAssociationTable.listingId,
            title: listingTable.title,
        })
            .from(streamListingAssociationTable)
            .where(eq(streamListingAssociationTable.streamId, payload.streamId))
            .innerJoin(
                listingTable,
                eq(streamListingAssociationTable.listingId, listingTable.id),
            );

        return {
            id: livestreamObj.id,
            title: livestreamObj.title,
            description: livestreamObj.description,
            hostUserId: livestreamObj.hostUserId,
            active: livestreamObj.active,
            listings,
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetStreamInfo = typeof get;