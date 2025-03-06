import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

import { client } from "$api/global";
import { db } from "$/lib/server/db";
import { livestream } from "$/lib/server/db/schema";
import { requiresLoggedInUser } from "$api/middleware";

export const POST: RequestHandler = requiresLoggedInUser(async (event, user) => {
    const calls = await db.select({})
        .from(livestream)
        .where(
            and(
                eq(livestream.hostUserId, user.id),
                eq(livestream.active, true)
            )
        )
        .limit(1);
    if (calls.length !== 0) {
        return error(400, "Host already has an ongoing stream");
    }

    const {livestreamId} = await event.request.json();

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
    
        db.update(livestream)
            .set({active: true})
            .where(eq(livestream.id, livestreamId)),
    ]);


    return json({});
});