import { error, type RequestHandler } from "@sveltejs/kit";

import { callHostSessionIds, callHostUserIds } from "../../global";

export const PUT: RequestHandler = async ({request}) => {
    const {callId, hostId, sessionId} = await request.json();

    if (callHostUserIds.get(callId) !== hostId) return error(403);

    callHostSessionIds.set(callId, sessionId);

    return new Response(JSON.stringify({}));
};