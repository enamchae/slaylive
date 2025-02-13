import { db } from "$/lib/server/db";
import { listing } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async () => {
    const listings = await db.select({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        sellerUserId: listing.sellerUserId,
    })
        .from(listing);

    return json({
        listings,
    });
};
