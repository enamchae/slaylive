import { eq } from "drizzle-orm";
import { db } from "../db";
import { listingImageTable } from "../db/schema";
import { supabaseServerClient } from "../supabase";

const bucket = "listing-images";

const getImageUrl = (imageId: string) => `public/${imageId}`;


export const addListingImage = async (listingId: string, image: File) => {
    const imageId = await generateListingImageId();
    const imagePath = getImageUrl(imageId);

    await db.insert(listingImageTable)
        .values({
            id: imageId,
            listingId,
        });

    const {error} = await supabaseServerClient
        .storage
        .from(bucket)
        .upload(imagePath, image, {
            contentType: image.type,
            upsert: false,
        });

    if (error) throw error;

    const {data, error: signedUrlError} = await supabaseServerClient
        .storage
        .from(bucket)
        .createSignedUrl(imagePath, 60 * 60 * 24);

    if (data === null || signedUrlError !== null) throw signedUrlError;

    return {
        id: imageId,
        url: data.signedUrl,
    };
};

export const deleteListingImage = async (imageId: string) => {
    const imageUrl = getImageUrl(imageId);

    const {error} = await supabaseServerClient
        .storage
        .from(bucket)
        .remove([imageUrl]);

    if (error) throw error;

    await db.delete(listingImageTable)
        .where(eq(listingImageTable.id, imageId));
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