import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

import { client } from "$api/global";
import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { requiresLoggedInUser } from "$api/middleware";

export const POST: RequestHandler = requiresLoggedInUser(async (user, event) => {
    const {livestreamId} = await event.request.json();

    const livestreams = await db.select()
        .from(livestreamTable)
        .where(eq(livestreamTable.id, livestreamId))
        .limit(1);
    if (livestreams.length === 0) {
        return error(400, "No livestream with the given id");
    }

    const livestream = livestreams[0];
    if (livestream.hostUserId !== user.id) {
        return error(403, "User is not the host of the livestream");
    }
    if (!livestream.active) {
        return error(400, "Livestream is not active");
    }

    const call = client.video.call("livestream", livestreamId);

    await Promise.all([
        call.end(),
    
        db.update(livestreamTable)
            .set({active: false})
            .where(eq(livestreamTable.id, livestreamId)),
    ]);


    return json({});
});