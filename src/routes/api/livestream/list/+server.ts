import { db } from "$/lib/server/db";
import { streamTable } from "$/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    async () => {
        const livestreams = await db.select()
            .from(streamTable)
            .where(eq(streamTable.active, true));

        return livestreams;
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetLivestreamList = typeof get;
