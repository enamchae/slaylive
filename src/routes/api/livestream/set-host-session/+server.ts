import { error, type RequestHandler, json } from "@sveltejs/kit";

import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { requiresLoggedInUser } from "$api/middleware";

export const PATCH: RequestHandler = requiresLoggedInUser(async ({request}, user) => {
    const {livestreamId, sessionId} = await request.json();

    const livestreamMatches = and(
        eq(livestreamTable.id, livestreamId),
        eq(livestreamTable.hostUserId, user.id),
    );

    const calls = await db.select({})
        .from(livestreamTable)
        .where(livestreamMatches)
        .limit(1);
    if (calls.length === 0) return error(400, "Call not found");

    
    await db.update(livestreamTable)
        .set({hostSessionId: sessionId})
        .where(livestreamMatches);

    return json({});
});