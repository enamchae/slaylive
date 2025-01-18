import type { RequestHandler } from "@sveltejs/kit";

import { client, callHosts } from "$api/global";

export const POST: RequestHandler = async ({ request }) => {
    const { userId } = await request.json();

    const callId = crypto.randomUUID();
    callHosts.set(callId, userId);

    const call = client.video.call("livestream", callId);

    call.create({
        data: {
            created_by_id: userId,
            members: [
                {user_id: userId, role: "admin"},
            ],
        },
    });

    return new Response(JSON.stringify({
        callId,
    }));
};
