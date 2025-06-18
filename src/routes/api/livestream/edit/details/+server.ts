import {error} from "@sveltejs/kit";
import {eq} from "drizzle-orm";

import { streamTable } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";
import { validate } from "$lib/validation";
import type { User } from "@supabase/supabase-js";
import { userOwnsStreamErrors } from "../user-owns-stream";

const endpoint = new PostEndpoint(
    async (
        {livestreamId, livestreamTitle, livestreamDescription}: {
            livestreamId: string,
            livestreamTitle: string,
            livestreamDescription: string,
        },
        {user}: {user: User},
    ) => {
        const err = await userOwnsStreamErrors(user, livestreamId);
        if (err !== null) return err;
    

        const validationResult = validate.listing({title: livestreamTitle, description: livestreamDescription});
        if (!validationResult.ok) {
            return error(400, JSON.stringify({errors: validationResult.errors}));
        }
        await db.update(streamTable)
            .set({
                title: livestreamTitle,
                description: livestreamDescription,
            })
            .where(eq(streamTable.id, livestreamId));

        // await db.delete(livestreamListingAssociationTable)
        //     .where(eq(livestreamListingAssociationTable.livestreamId, livestreamId));
        
        // if (livestreamListingIds.length > 0) {
        //     await db.insert(livestreamListingAssociationTable)
        //         .values(livestreamListingIds.map(listingId => ({
        //             listingId,
        //             livestreamId,
        //         })));
        // }

        return {};
    },
);

export const PATCH = requiresLoggedInUser(async (user, event) => endpoint.callHandler({user}, event));
export type EditStreamDetails = typeof endpoint;
