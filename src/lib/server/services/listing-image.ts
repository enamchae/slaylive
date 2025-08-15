import { eq } from "drizzle-orm";
import { db } from "../db";
import { listingImageTable } from "../db/schema";
import { supabaseServerClient } from "../supabase";

const bucket = "listing-images";

const getImageUrl = (imageId: string) => `public/${imageId}`;


export const addListingImage = async (listingId: string, image: File) => {
    const imageId = await generateListingImageId();
    const imageUrl = getImageUrl(imageId);

    await db.insert(listingImageTable)
        .values({
            id: imageId,
            listingId,
        });

    const {error} = await supabaseServerClient
        .storage
        .from(bucket)
        .upload(imageUrl, image, {
            contentType: image.type,
            upsert: false,
        });

    if (error) throw error;

    return {
        id: imageId,
        url: imageUrl,
    };
};


const generateListingImageId = async () => {
    let listingImageId: string;
    while (true) {
        listingImageId = crypto.randomUUID();

        const listingImages = await db.select({})
            .from(listingImageTable)
            .where(eq(listingImageTable.id, listingImageId))
            .limit(1);
        if (listingImages.length === 0) break;
    }

    return listingImageId;
};