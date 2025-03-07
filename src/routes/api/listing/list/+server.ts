import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async () => {
    const listings = await db.select({
        id: listingTable.id,
        title: listingTable.title,
        description: listingTable.description,
        sellerUserId: listingTable.sellerUserId,
    })
        .from(listingTable);

    return json({
        listings,
    });
};
