import {error, json, type RequestHandler} from "@sveltejs/kit";
import {eq} from "drizzle-orm";

import { listingTable, userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { PostEndpoint, requiresLoggedInUser } from "../../middleware";
import { validate } from "$/lib/shared/validation";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (
        {
            listingTitle,
            listingDescription,
            listingOnDisplay,
        }: {
            listingTitle: string,
            listingDescription: string,
            listingOnDisplay: boolean,
        },
        {user}: {user: User},
    ) => {
        

        const userObjs = await db.select({canSell: userTable.canSell})
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);

        if (userObjs.length === 0) return error(500, "User not found");

        const userObj = userObjs[0];
        if (!userObj.canSell) return error(403, "User is not a seller");

        const validationResult = validate.listing({title: listingTitle, description: listingDescription});
        if (!validationResult.ok) {
            return error(400, JSON.stringify({errors: validationResult.errors}));
        }

        const listingId = await generateListingId();
        await db.insert(listingTable)
            .values({
                id: listingId,
                sellerUserId: user.id,
                title: listingTitle,
                description: listingDescription,
                onDisplay: listingOnDisplay,
            });

        return {listingId};
    },
);

export const PUT = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type NewListing = typeof endpoint;

const generateListingId = async () => {
    let listingId: string;
    while (true) {
        listingId = crypto.randomUUID();

        const listings = await db.select({})
            .from(listingTable)
            .where(eq(listingTable.id, listingId))
            .limit(1);
        if (listings.length === 0) break;
    }

    return listingId;
};