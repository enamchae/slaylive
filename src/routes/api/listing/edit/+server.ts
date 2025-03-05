import {error, json, type RequestHandler} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";

import { listing, user as userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { requiresLoggedInUser } from "../../middleware";
import { validate } from "$lib/validation";

export const PATCH: RequestHandler = requiresLoggedInUser(async ({request}, user) => {
    const {listingId, listingTitle, listingDescription, listingOnDisplay} = await request.json();
    
    
    const userObjs = await db.select({canSell: userTable.canSell, id: userTable.id})
        .from(userTable)
        .where(eq(userTable.id, user.id))
        .limit(1);

    if (userObjs.length === 0) return error(500, "User not found");

    const userObj = userObjs[0];
    if (!userObj.canSell) return error(403, "User is not a seller");

    const listingObjs = await db.select({sellerUserId: listing.sellerUserId})
        .from(listing)
        .where(eq(listing.id, listingId))
        .limit(1);
    if (listingObjs.length === 0) return error(404, "Listing not found");
    
    const listingObj = listingObjs[0];
    if (listingObj.sellerUserId !== userObj.id) return error(403, "User is not the seller of this product");


    const validationResult = validate.listing({title: listingTitle, description: listingDescription});
    if (!validationResult.ok) {
        return error(400, JSON.stringify({errors: validationResult.errors}));
    }
    await db.update(listing)
        .set({
            sellerUserId: user.id,
            title: listingTitle,
            description: listingDescription,
            onDisplay: listingOnDisplay,
        })
        .where(eq(listing.id, listingId));

    return json({});
});