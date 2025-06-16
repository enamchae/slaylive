import { db } from "$/lib/server/db";
import { listingTable } from "$/lib/server/db/schema";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    () => ({}),
    
    async () => {
        const listings = await db.select({
            id: listingTable.id,
            title: listingTable.title,
            description: listingTable.description,
            sellerUserId: listingTable.sellerUserId,
        })
            .from(listingTable);

        return { listings };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type Endpoint = typeof get;