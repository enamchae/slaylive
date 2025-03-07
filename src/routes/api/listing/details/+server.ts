import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const listingId = url.searchParams.get("listingId");
    if (listingId === null) return error(400, "Missing listing id");

    const listings = await db.select({
        title: listingTable.title,
        description: listingTable.description,
        onDisplay: listingTable.onDisplay,
        sellerUserId: listingTable.sellerUserId,
    })
        .from(listingTable)
        .where(eq(listingTable.id, listingId))
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
