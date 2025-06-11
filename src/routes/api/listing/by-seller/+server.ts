import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint } from "$api/middleware";


const get = new GetEndpoint(
    searchParams => {
        const sellerUserId = searchParams.get("sellerUserId");
        if (sellerUserId === null) return error(400, "Missing seller user id");

        return { sellerUserId };
    },

    async payload => {
        const sellerUserId = payload.sellerUserId;

        const listings = await db.select({
            id: listingTable.id,
            title: listingTable.title,
            description: listingTable.description,
        })
            .from(listingTable)
            .where(eq(listingTable.sellerUserId, sellerUserId));

        return {listings};
    },
);

export const GET = get.handler();
export type Endpoint = typeof get;