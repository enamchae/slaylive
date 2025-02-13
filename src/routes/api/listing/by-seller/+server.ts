import { db } from "$/lib/server/db";
import { listing } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const sellerUserId = url.searchParams.get("sellerUserId");

    if (sellerUserId === null) return error(400, "Missing seller user id");

    const listings = await db.select({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        sellerUserId: listing.sellerUserId,
    })
        .from(listing)
        .where(eq(listing.sellerUserId, sellerUserId));

    return json({
        listings,
    });
};
