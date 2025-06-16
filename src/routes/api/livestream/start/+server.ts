import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

import { streamio } from "$api/global";
import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { requiresLoggedInUser } from "$api/middleware";

export const POST: RequestHandler = requiresLoggedInUser(async (user, event) => {
    const calls = await db.select({})
        .from(livestreamTable)
        .where(
            and(
                eq(livestreamTable.hostUserId, user.id),
                eq(livestreamTable.active, true)
            )
        )
        .limit(1);
    if (calls.length !== 0) {
        return error(400, "Host already has an ongoing stream");
    }

    const {livestreamId} = await event.request.json();

    const call = streamio.video.call("livestream", livestreamId);

    await Promise.all([
        call.create({
            data: {
                created_by_id: user.id,
                members: [
                    {user_id:  user.id, role: "user"},
                ],
            },
        }),
    
        db.update(livestreamTable)
            .set({active: true})
            .where(eq(livestreamTable.id, livestreamId)),
    ]);


    return json({});
});