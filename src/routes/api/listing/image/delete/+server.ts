import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$/lib/server/db";
import { listingImageTable, listingTable, userTable } from "$/lib/server/db/schema";
import { PostEndpoint, requiresLoggedInUser } from "../../../middleware";
import { deleteListingImage } from "$/lib/server/services/listing-image";
import type { User } from "@supabase/supabase-js";

const endpoint = new PostEndpoint(
    async (
        {
            imageId,
        }: {
            imageId: string;
        },
        { user }: { user: User }
    ) => {
        // Get image details
        const imageObjs = await db
            .select({ listingId: listingImageTable.listingId })
            .from(listingImageTable)
            .where(eq(listingImageTable.id, imageId))
            .limit(1);

        if (imageObjs.length === 0) return error(404, "Image not found");

        const imageObj = imageObjs[0];

        // Verify user owns the listing
        const listingObjs = await db
            .select({ sellerUserId: listingTable.sellerUserId })
            .from(listingTable)
            .where(eq(listingTable.id, imageObj.listingId))
            .limit(1);

        if (listingObjs.length === 0) return error(404, "Listing not found");

        const listingObj = listingObjs[0];
        if (listingObj.sellerUserId !== user.id) {
            return error(403, "User is not the seller of this listing");
        }

        try {
            await deleteListingImage(imageId);
            return { success: true };
        } catch (err) {
            console.error("Failed to delete image:", err);
            return error(500, "Failed to delete image");
        }
    }
);

export const DELETE = requiresLoggedInUser(async (user, event) =>
    endpoint.callHandler({ user }, event)
);

export type DeleteListingImage = typeof endpoint;
