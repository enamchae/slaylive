import { error } from "@sveltejs/kit";

import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { PostEndpoint, requiresLoggedInUser } from "$api/middleware";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (payload: {livestreamId: string, sessionId: string}, {user}: {user: User}) => {
        const livestreamMatches = and(
            eq(livestreamTable.id, payload.livestreamId),
            eq(livestreamTable.hostUserId, user.id),
        );

        const calls = await db.select({})
            .from(livestreamTable)
            .where(livestreamMatches)
            .limit(1);
        if (calls.length === 0) return error(400, "Call not found");

        
        await db.update(livestreamTable)
            .set({hostSessionId: payload.sessionId})
            .where(livestreamMatches);

        return {};
    },
);

export const PATCH = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type SetHostSession = typeof endpoint;