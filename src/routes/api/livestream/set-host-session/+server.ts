import { error, type RequestHandler } from "@sveltejs/kit";

import { db } from "$/lib/server/db";
import { livestream } from "$/lib/server/db/schema";
import { and, eq } from "drizzle-orm";

export const PUT: RequestHandler = async ({request, locals: {user}}) => {
    if (user === null) return error(401, "Not logged in");

    const {callId, sessionId} = await request.json();

    const livestreamMatches = and(
        eq(livestream.callId, callId),
        eq(livestream.hostSessionId, user.id),
    );

    const calls = await db.select({})
        .from(livestream)
        .where(livestreamMatches)
        .limit(1);
    if (calls.length === 0) return error(400, "Call not found");

    
    await db.update(livestream)
        .set({hostSessionId: sessionId})
        .where(livestreamMatches);

    return new Response(JSON.stringify({}));
};