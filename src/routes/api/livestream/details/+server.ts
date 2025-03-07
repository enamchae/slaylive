import { db } from "$/lib/server/db";
import { listingTable, livestreamTable, livestreamListingAssociationTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq, exists } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const livestreamId = url.searchParams.get("livestreamId");
    if (livestreamId === null) return error(400, "Missing livestream id");

    const livestreams = await db.select({
        id: livestreamTable.id,
        title: livestreamTable.title,
        description: livestreamTable.description,
        hostUserId: livestreamTable.hostUserId,
        active: livestreamTable.active,
    })
        .from(livestreamTable)
        .where(eq(livestreamTable.id, livestreamId))
        .limit(1);

    if (livestreams.length === 0) return error(404, "No livestream found");

    const livestreamObj = livestreams[0];

    return json({
        id: livestreamObj.id,
        title: livestreamObj.title,
        description: livestreamObj.description,
        hostUserId: livestreamObj.hostUserId,
        active: livestreamObj.active,
        listings: await db.select({
            id: livestreamListingAssociationTable.listingId,
        })
            .from(livestreamListingAssociationTable)
            .where(eq(livestreamListingAssociationTable.livestreamId, livestreamId)),
    });
};
