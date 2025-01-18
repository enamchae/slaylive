import type { RequestHandler } from "@sveltejs/kit";

import { client, callHostUserIds, callHostSessionIds } from "$api/global";

export const POST: RequestHandler = async ({ request }) => {
    const { userId } = await request.json();

    const callId = crypto.randomUUID();

    const call = client.video.call("livestream", callId);

    await call.create({
        data: {
            created_by_id: userId,
            members: [
                {user_id: userId, role: "admin"},
            ],
        },
    });

    callHostUserIds.set(callId, userId);

    return new Response(JSON.stringify({
        callId,
    }));
};
