import { error } from "@sveltejs/kit";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";
import type { User } from "@supabase/supabase-js";
import { getListingDetails as getListingDetails } from "$/lib/server/listing";


const get = new GetEndpoint(
    async (payload: {
        listingId: string,
    }, {user}: {user: User}) => {
        const listing = await getListingDetails(payload.listingId, user);

        if (!listing) {
            return error(404, "No listing found");
        }

        return {
            title: listing.title,
            description: listing.description,
            onDisplay: listing.onDisplay,
            images: listing.images,
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler({user}, event));
export type GetListingDetails = typeof get;
