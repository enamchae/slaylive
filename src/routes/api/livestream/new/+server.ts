import {error, json, type RequestHandler} from "@sveltejs/kit";
import {and, eq} from "drizzle-orm";

import { listingTable, livestreamTable, livestreamListingAssociationTable, userTable as userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { requiresLoggedInUser } from "../../middleware";
import { validate } from "$lib/validation";
import { client } from "../../global";

export const PUT: RequestHandler = requiresLoggedInUser(async (user, {request}) => {
    const {livestreamTitle, livestreamDescription, livestreamListingIds}: {
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


    // const validationResult = validate.listing({title: livestreamTitle, description: livestreamDescription});
    // if (!validationResult.ok) {
    //     return error(400, JSON.stringify({errors: validationResult.errors}));
    // }

    const livestreamId = await generateLivestreamId();
    
    const call = client.video.call("livestream", livestreamId);

    await Promise.all([
        call.create({
            data: {
                created_by_id: user.id,
                members: [
                    {user_id:  user.id, role: "user"},
                ],
            },
        }),
    
        db.insert(livestreamTable)
            .values({
                id: livestreamId,
                hostUserId: user.id,
                title: livestreamTitle,
                description: livestreamDescription,
            })
            .then(() => db.insert(livestreamListingAssociationTable)
                .values(livestreamListingIds.map(listingId => ({
                    listingId,
                    livestreamId,
                })))
            ),
    ]);


    return json({livestreamId});
});


const generateLivestreamId = async () => {
    let id: string;
    while (true) {
        id = crypto.randomUUID();

        const calls = await db.select({})
            .from(livestreamTable)
            .where(eq(livestreamTable.id, id))
            .limit(1);
        if (calls.length === 0) break;
    }

    return id;
};