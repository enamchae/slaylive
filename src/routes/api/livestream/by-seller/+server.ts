import { db } from "$/lib/server/db";
import { streamTable } from "$/lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "$api/middleware";


const get = new GetEndpoint(
    async (payload: {
        sellerUserId: string,
    }) => {
        // if (sellerUserId === null) return error(400, "Missing seller user id");
        
        const livestreams = await db.select({
            id: streamTable.id,
            title: streamTable.title,
            description: streamTable.description,
            hostUserId: streamTable.hostUserId,
            active: streamTable.active,
        })
            .from(streamTable)
            .where(eq(streamTable.hostUserId, payload.sellerUserId));

        return {livestreams};
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetLivestreamsBySeller = typeof get;