import { GetEndpoint, requiresLoggedInUser } from "../../middleware";
import type { User } from "@supabase/supabase-js";
import { listListingsWithSingleImage } from "$/lib/server/listing";


const get = new GetEndpoint(
    async ({}, user: User) => {
        const listings = await listListingsWithSingleImage(user);

        return {
            listings,
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(user, event));
export type GetListingList = typeof get;