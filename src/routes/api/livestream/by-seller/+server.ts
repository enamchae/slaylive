import { db } from "$/lib/server/db";
import { listingTable, livestreamTable } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const hostUserId = url.searchParams.get("hostUserId");

    if (hostUserId === null) return error(400, "Missing host user id");

    const livestreams = await db.select({
        id: livestreamTable.id,
        title: livestreamTable.title,
        description: livestreamTable.description,
        hostUserId: livestreamTable.hostUserId,
        active: livestreamTable.active,
    })
        .from(livestreamTable)
        .where(eq(livestreamTable.hostUserId, hostUserId));

    return json({
        livestreams,
    });
};
