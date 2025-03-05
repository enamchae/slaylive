import { db } from "$/lib/server/db";
import { listing, livestream } from "$/lib/server/db/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
    const hostUserId = url.searchParams.get("hostUserId");

    if (hostUserId === null) return error(400, "Missing host user id");

    const livestreams = await db.select({
        id: livestream.id,
        title: livestream.title,
        description: livestream.description,
        hostUserId: livestream.hostUserId,
    })
        .from(livestream)
        .where(eq(livestream.hostUserId, hostUserId));

    return json({
        livestreams,
    });
};
