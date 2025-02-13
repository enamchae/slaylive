import {error, json, type RequestHandler} from "@sveltejs/kit";
import {eq} from "drizzle-orm";

import { listing } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { requiresLoggedInUser } from "../../middleware";
import { validate } from "$lib/validation";

export const PATCH: RequestHandler = requiresLoggedInUser(async ({request}, user) => {
    const {listingId, listingTitle, listingDescription, listingOnDisplay} = await request.json();


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