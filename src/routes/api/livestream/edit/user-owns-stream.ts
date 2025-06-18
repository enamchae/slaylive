import {error} from "@sveltejs/kit";
import {eq} from "drizzle-orm";

import { streamTable, userTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import type { User } from "@supabase/supabase-js";


export const userOwnsStreamErrors = async (user: User, streamId: string) => {
    const userObjs = await db.select({canSell: userTable.canSell, id: userTable.id})
        .from(userTable)
        .where(eq(userTable.id, user.id))
        .limit(1);

    if (userObjs.length === 0) return error(500, "User not found");

    const userObj = userObjs[0];
    if (!userObj.canSell) return error(403, "User is not a seller");

    const livestreamObjs = await db.select({hostUserId: streamTable.hostUserId})
        .from(streamTable)
        .where(eq(streamTable.id, streamId))
        .limit(1);
    if (livestreamObjs.length === 0) return error(404, "Livestream not found");
    
    const livestreamObj = livestreamObjs[0];
    if (livestreamObj.hostUserId !== userObj.id) return error(403, "User is not the host of this livestream");


    return null;
};