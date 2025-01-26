import { error, type RequestHandler } from "@sveltejs/kit";

import { client } from "$api/global";
import { db } from "$/lib/server/db";
import { livestream } from "$/lib/server/db/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ locals: {user} }) => {
    if (user === null) return error(401, "Not logged in");

    const calls = await db.select({})
        .from(livestream)
        .where(eq(livestream.hostUserId, user.id))
        .limit(1);
    if (calls.length !== 0) {
        return error(400, "Host already has an ongoing stream");
    }

    const callId = await generateCallId();

    const call = client.video.call("livestream", callId);
    
    await Promise.all([
        call.create({
            data: {
                created_by_id: user.id,
                members: [
                    {user_id:  user.id, role: "admin"},
                ],
            },
        }),
    
        db.insert(livestream).values({callId, hostUserId: user.id}),        
    ]);


    return new Response(JSON.stringify({
        callId,
    }));
};

const generateCallId = async () => {
    let callId: string;
    while (true) {
        callId = crypto.randomUUID();

        const calls = await db.select({})
            .from(livestream)
            .where(eq(livestream.callId, callId))
            .limit(1);
        if (calls.length === 0) break;
    }

    return callId;
};