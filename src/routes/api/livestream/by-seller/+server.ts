import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "$api/middleware";


const get = new GetEndpoint(
    async (payload: {
        sellerUserId: string,
    }) => {
        // if (sellerUserId === null) return error(400, "Missing seller user id");
        
        const livestreams = await db.select({
            id: livestreamTable.id,
            title: livestreamTable.title,
            description: livestreamTable.description,
            hostUserId: livestreamTable.hostUserId,
            active: livestreamTable.active,
        })
            .from(livestreamTable)
            .where(eq(livestreamTable.hostUserId, payload.sellerUserId));

        return {livestreams};
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetLivestreamsBySeller = typeof get;