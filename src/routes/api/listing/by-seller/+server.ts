import { GetEndpoint, requiresLoggedInUser } from "$api/middleware";
import { fetchListingsBySeller } from "$/lib/server/listing";


const get = new GetEndpoint(
    async ({
        sellerUserId,
    }: {
        sellerUserId: string,
    }) => {
        const listings = await fetchListingsBySeller(sellerUserId);

        return {listings};
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetListingsBySeller = typeof get;