import { db } from "$/lib/server/db";
import { livestream } from "$/lib/server/db/schema";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async (event) => {
    const livestreams = await db.select()
        .from(livestream)
        .where(eq(livestream.active, true));

    return json(livestreams);
};