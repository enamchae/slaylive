import { error, type RequestHandler } from "@sveltejs/kit";

import { callHostUserIds, callHostSessionIds } from "$api/global";

export const GET: RequestHandler = async ({ url }) => {
    const callId = url.searchParams.get("call_id");

    if (callId === null) {
        return error(404, JSON.stringify({}));
    }

    return new Response(JSON.stringify({
        hostUserId: callHostUserIds.get(callId) ?? null,
        hostSessionId: callHostSessionIds.get(callId) ?? null,
    }));
};
