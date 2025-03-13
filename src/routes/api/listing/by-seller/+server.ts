import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const sellerUserId = url.searchParams.get("sellerUserId");

    if (sellerUserId === null) return error(400, "Missing seller user id");

    const listings = await db.select({
        id: listingTable.id,
        title: listingTable.title,
        description: listingTable.description,
    })
        .from(listingTable)
        .where(eq(listingTable.sellerUserId, sellerUserId));

    return json({
        listings,
    });
};
