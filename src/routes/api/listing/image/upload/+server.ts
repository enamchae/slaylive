import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "$/lib/server/db";
import { listingTable, userTable } from "$/lib/server/db/schema";
import { FilePostEndpoint, requiresLoggedInUser } from "../../../middleware";
import { addListingImage } from "$/lib/server/services/listing-image";
import type { User } from "@supabase/supabase-js";

const endpoint = new FilePostEndpoint(
    async (
        {
            listingId,
            image,
        }: {
            listingId: string;
            image: File;
        },
        { user }: { user: User }
    ) => {
        // Verify user can sell
        const userObjs = await db
            .select({ canSell: userTable.canSell })
            .from(userTable)
            .where(eq(userTable.id, user.id))
            .limit(1);

        if (userObjs.length === 0) return error(500, "User not found");

        const userObj = userObjs[0];
        if (!userObj.canSell) return error(403, "User is not a seller");

        // Verify user owns the listing
        const listingObjs = await db
            .select({ sellerUserId: listingTable.sellerUserId })
            .from(listingTable)
            .where(eq(listingTable.id, listingId))
            .limit(1);

        if (listingObjs.length === 0) return error(404, "Listing not found");

        const listingObj = listingObjs[0];
        if (listingObj.sellerUserId !== user.id) {
            return error(403, "User is not the seller of this listing");
        }

        // Validate image
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.size > maxSize) {
            return error(400, "Image size must be less than 5MB");
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(image.type)) {
            return error(400, "Invalid image type. Allowed: JPEG, PNG, WebP");
        }

        try {
            const imageData = await addListingImage(listingId, image);
            return {
                id: imageData.id,
                url: imageData.url,
            };
        } catch (err) {
            console.error("Failed to upload image:", err);
            return error(500, "Failed to upload image");
        }
    }
);

export const POST = requiresLoggedInUser(async (user, event) =>
    endpoint.callHandler({ user }, event)
);

export type UploadListingImage = typeof endpoint;
