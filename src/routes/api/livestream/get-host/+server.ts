import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    async (payload: {
        call_id: string,
    }) => {
        // if (call_id === null) return error(400, "Missing call id");

        const calls = await db.select({
            hostUserId: livestreamTable.hostUserId,
            hostSessionId: livestreamTable.hostSessionId,
        })
            .from(livestreamTable)
            .where(eq(livestreamTable.id, payload.call_id))
            .limit(1);

        if (calls.length === 0) return error(404, "No livestream with the given id");

        const call = calls[0];
        if (call.hostSessionId === null) return error(400, "Livestream has not started yet");

        return {
            hostUserId: call.hostUserId,
            hostSessionId: call.hostSessionId,
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetLivestreamHost = typeof get;