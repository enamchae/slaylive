import { error, type RequestHandler } from "@sveltejs/kit";

import { callHosts } from "$api/global";

export const GET: RequestHandler = async ({ url }) => {
    const callId = url.searchParams.get("call_id");

    if (callId === null) {
        return error(404, JSON.stringify({}));
    }

    return new Response(JSON.stringify({
        hostUserId: callHosts.get(callId) ?? null,
    }));
};
