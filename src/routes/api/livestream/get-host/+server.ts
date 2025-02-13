import { db } from "$/lib/server/db";
import { livestream } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const callId = url.searchParams.get("call_id");

    if (callId === null) return error(400, "Missing call id");

    const calls = await db.select({
        hostUserId: livestream.hostUserId,
        hostSessionId: livestream.hostSessionId,
    })
        .from(livestream)
        .where(eq(livestream.callId, callId))
        .limit(1);

    if (calls.length === 0) return error(404, "No livestream with the given id");

    const call = calls[0];
    if (call.hostSessionId === null) return error(400, "Livestream has not started yet");

    return json({
        hostUserId: call.hostUserId,
        hostSessionId: call.hostSessionId,
    });
};
