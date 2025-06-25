import {error} from "@sveltejs/kit";
import {eq} from "drizzle-orm";

import { listingTable, userTable as userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { PostEndpoint, requiresLoggedInUser } from "../../middleware";
import { validate } from "$lib/validation";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (
        payload: {
            listingId: string,
            listingTitle: string,
            listingDescription: string,
            listingOnDisplay: boolean,
        },
        {user}: {user: User},
    ) => {
        const userObjs = await db.select({canSell: userTable.canSell, id: userTable.id})
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);

        if (userObjs.length === 0) return error(500, "User not found");

        const userObj = userObjs[0];
        if (!userObj.canSell) return error(403, "User is not a seller");

        const listingObjs = await db.select({sellerUserId: listingTable.sellerUserId})
            .from(listingTable)
            .where(eq(listingTable.id, payload.listingId))
            .limit(1);
        if (listingObjs.length === 0) return error(404, "Listing not found");

        const listingObj = listingObjs[0];
        if (listingObj.sellerUserId !== userObj.id) return error(403, "User is not the seller of this product");

        const validationResult = validate.listing({title: payload.listingTitle, description: payload.listingDescription});
        if (!validationResult.ok) {
            return error(400, JSON.stringify({errors: validationResult.errors}));
        }

        await db.update(listingTable)
            .set({
                sellerUserId: user.id,
                title: payload.listingTitle,
                description: payload.listingDescription,
                onDisplay: payload.listingOnDisplay,
            })
            .where(eq(listingTable.id, payload.listingId));

        return {};
    },
);

export const PATCH = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type EditListing = typeof endpoint;