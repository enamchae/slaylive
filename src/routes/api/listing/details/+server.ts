import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    searchParams => {
        const listingId = searchParams.get("listingId");
        if (listingId === null) return error(400, "Missing listing id");

        return { listingId };
    },

    async payload => {
        const listings = await db.select({
            title: listingTable.title,
            description: listingTable.description,
            onDisplay: listingTable.onDisplay,
            sellerUserId: listingTable.sellerUserId,
        })
            .from(listingTable)
            .where(eq(listingTable.id, payload.listingId))
            .limit(1);

        if (listings.length === 0) return error(404, "No listing found");

        const listingObj = listings[0];
        // TODO 404 when onDisplay is false and user does not match seller id

        return {
            title: listingObj.title,
            description: listingObj.description,
            onDisplay: listingObj.onDisplay,
            imageUrls: [],
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type Endpoint = typeof get;
