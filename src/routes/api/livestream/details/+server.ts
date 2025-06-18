import { db } from "$/lib/server/db";
import { livestreamTable, livestreamListingAssociationTable } from "$/lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    async (payload: {
        livestreamId: string,
    }) => {
        // if (livestreamId === null) return error(400, "Missing livestream id");

        const livestreams = await db.select({
            id: livestreamTable.id,
            title: livestreamTable.title,
            description: livestreamTable.description,
            hostUserId: livestreamTable.hostUserId,
            active: livestreamTable.active,
        })
            .from(livestreamTable)
            .where(eq(livestreamTable.id, payload.livestreamId))
            .limit(1);

        if (livestreams.length === 0) return error(404, "No livestream found");

        const livestreamObj = livestreams[0];

        return {
            id: livestreamObj.id,
            title: livestreamObj.title,
            description: livestreamObj.description,
            hostUserId: livestreamObj.hostUserId,
            active: livestreamObj.active,
            listings: await db.select({
                id: livestreamListingAssociationTable.listingId,
            })
                .from(livestreamListingAssociationTable)
                .where(eq(livestreamListingAssociationTable.livestreamId, payload.livestreamId)),
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetLivestreamDetails = typeof get;