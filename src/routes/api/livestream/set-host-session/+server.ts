import { error, type RequestHandler, json } from "@sveltejs/kit";

import { db } from "$/lib/server/db";
import { livestream } from "$/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { requiresLoggedInUser } from "$api/middleware";

export const PATCH: RequestHandler = requiresLoggedInUser(async ({request}, user) => {
    const {callId, sessionId} = await request.json();

    const livestreamMatches = and(
        eq(livestream.callId, callId),
        eq(livestream.hostUserId, user.id),
    );

    const calls = await db.select({})
        .from(livestream)
        .where(livestreamMatches)
        .limit(1);
    if (calls.length === 0) return error(400, "Call not found");

    
    await db.update(livestream)
        .set({hostSessionId: sessionId})
        .where(livestreamMatches);

    return json({});
});