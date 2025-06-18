import { error } from "@sveltejs/kit";

import { db } from "$/lib/server/db";
import { streamTable } from "$/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { PostEndpoint, requiresLoggedInUser } from "$api/middleware";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (payload: {streamId: string, sessionId: string}, {user}: {user: User}) => {
        const livestreamMatches = and(
            eq(streamTable.id, payload.streamId),
            eq(streamTable.hostUserId, user.id),
        );

        const calls = await db.select({})
            .from(streamTable)
            .where(livestreamMatches)
            .limit(1);
        if (calls.length === 0) return error(400, "Call not found");

        
        await db.update(streamTable)
            .set({hostSessionId: payload.sessionId})
            .where(livestreamMatches);

        return {};
    },
);

export const PATCH = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type SetStreamHostSession = typeof endpoint;