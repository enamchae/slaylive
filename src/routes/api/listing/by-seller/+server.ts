import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "$api/middleware";


const get = new GetEndpoint(
    async (payload: {
        sellerUserId: string,
    }) => {
        // if (sellerUserId === null) return error(400, "Missing seller user id");

        const listings = await db.select({
            id: listingTable.id,
            title: listingTable.title,
            description: listingTable.description,
        })
            .from(listingTable)
            .where(eq(listingTable.sellerUserId, payload.sellerUserId));

        return {listings};
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetListingsBySeller = typeof get;