import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

import { streamio } from "$api/global";
import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { PostEndpoint, requiresLoggedInUser } from "$api/middleware";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (payload: {livestreamId: string}, {user}: {user: User}) => {
        const livestreams = await db.select()
            .from(livestreamTable)
            .where(eq(livestreamTable.id, payload.livestreamId))
            .limit(1);
        if (livestreams.length === 0) {
            return error(400, "No livestream with the given id");
        }

        const livestream = livestreams[0];
        if (livestream.hostUserId !== user.id) {
            return error(403, "User is not the host of the livestream");
        }
        if (!livestream.active) {
            return error(400, "Livestream is not active");
        }

        const call = streamio.video.call("livestream", payload.livestreamId);

        await Promise.all([
            call.end(),
        
            db.update(livestreamTable)
                .set({active: false})
                .where(eq(livestreamTable.id, payload.livestreamId)),
        ]);


        return {};
    },
);

export const POST = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type StopLivestream = typeof endpoint;