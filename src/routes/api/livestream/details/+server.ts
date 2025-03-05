import { db } from "$/lib/server/db";
import { listing, livestream, livestreamListingAssociation } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq, exists } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const livestreamId = url.searchParams.get("livestreamId");
    if (livestreamId === null) return error(400, "Missing livestream id");

    const livestreams = await db.select({
        id: livestream.id,
        title: livestream.title,
        description: livestream.description,
        hostUserId: livestream.hostUserId,
    })
        .from(livestream)
        .where(eq(livestream.id, livestreamId))
        .limit(1);

    if (livestreams.length === 0) return error(404, "No livestream found");

    const livestreamObj = livestreams[0];

    return json({
        id: livestreamObj.id,
        title: livestreamObj.title,
        description: livestreamObj.description,
        hostUserId: livestreamObj.hostUserId,
        listings: await db.select({
            id: livestreamListingAssociation.listingId,
        })
            .from(livestreamListingAssociation)
            .where(eq(livestreamListingAssociation.livestreamId, livestreamId)),
    });
};
