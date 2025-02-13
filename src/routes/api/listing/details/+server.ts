import { db } from "$/lib/server/db";
import { listing } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const listingId = url.searchParams.get("listingId");
    if (listingId === null) return error(400, "Missing listing id");

    const listings = await db.select({
        title: listing.title,
        description: listing.description,
        onDisplay: listing.onDisplay,
        sellerUserId: listing.sellerUserId,
    })
        .from(listing)
        .where(eq(listing.id, listingId))
        .limit(1);

    if (listings.length === 0) return error(404, "No listing found");

    const listingObj = listings[0];
    // TODO 404 when onDisplay is false and user does not match seller id

    return json({
        title: listingObj.title,
        description: listingObj.description,
        onDisplay: listingObj.onDisplay,
        imageUrls: [],
    });
};
