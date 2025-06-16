import { db } from "$/lib/server/db";
import { livestreamTable } from "$/lib/server/db/schema";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";


const get = new GetEndpoint(
    () => ({}),

    async () => {
        const livestreams = await db.select()
            .from(livestreamTable)
            .where(eq(livestreamTable.active, true));

        return livestreams;
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type Endpoint = typeof get;
