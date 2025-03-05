import {error, json, type RequestHandler} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";

import { listing, livestream, livestreamListingAssociation, user as userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { requiresLoggedInUser } from "../../middleware";
import { validate } from "$lib/validation";

export const PATCH: RequestHandler = requiresLoggedInUser(async ({request}, user) => {
    const {livestreamId, livestreamTitle, livestreamDescription, livestreamListingIds}: {
        livestreamId: string,
        livestreamTitle: string,
        livestreamDescription: string,
        livestreamListingIds: string[],
    } = await request.json();
    
    
    const userObjs = await db.select({canSell: userTable.canSell, id: userTable.id})
        .from(userTable)
        .where(eq(userTable.id, user.id))
        .limit(1);

    if (userObjs.length === 0) return error(500, "User not found");

    const userObj = userObjs[0];
    if (!userObj.canSell) return error(403, "User is not a seller");

    const livestreamObjs = await db.select({hostUserId: livestream.hostUserId})
        .from(livestream)
        .where(eq(livestream.id, livestreamId))
        .limit(1);
    if (livestreamObjs.length === 0) return error(404, "Livestream not found");
    
    const livestreamObj = livestreamObjs[0];
    if (livestreamObj.hostUserId !== userObj.id) return error(403, "User is not the host of this livestream");


    const validationResult = validate.listing({title: livestreamTitle, description: livestreamDescription});
    if (!validationResult.ok) {
        return error(400, JSON.stringify({errors: validationResult.errors}));
    }
    await db.update(livestream)
        .set({
            title: livestreamTitle,
            description: livestreamDescription,
        })
        .where(eq(livestream.id, livestreamId));

    await db.delete(livestreamListingAssociation)
        .where(eq(livestreamListingAssociation.livestreamId, livestreamId));
    
    await db.insert(livestreamListingAssociation)
        .values(livestreamListingIds.map(listingId => ({
            listingId,
            livestreamId,
        })));


    return json({});
});
