import { eq } from "drizzle-orm";
import { db } from "./db";
import { listingImageTable } from "./db/schema";
import { supabaseServerClient } from "./supabase";

const bucket = "listing-images";

const getBucketUrl = (imageId: string) => `public/${imageId}`;


export const addListingImage = async (listingId: string, image: File) => {
    const imageId = await generateListingImageId();
    const imagePath = getBucketUrl(imageId);

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

    const url = await getListingImageUrl(imageId);

    return {
        id: imageId,
        url,
    };
};

export const deleteListingImage = async (imageId: string) => {
    const imageUrl = getBucketUrl(imageId);

    const {error} = await supabaseServerClient
        .storage
        .from(bucket)
        .remove([imageUrl]);

    if (error) throw error;

    await db.delete(listingImageTable)
        .where(eq(listingImageTable.id, imageId));
};

export const getListingImageUrl = async (imageId: string) => {
    const {data, error: signedUrlError} = await supabaseServerClient
        .storage
        .from(bucket)
        .createSignedUrl(getBucketUrl(imageId), 60 * 60 * 24);

    if (data === null || signedUrlError !== null) throw signedUrlError;

    return data.signedUrl;
};

export const getListingFirstImage = async (listingId: string) => {
    const imageResults = await db.select()
        .from(listingImageTable)
        .where(eq(listingImageTable.listingId, listingId))
        .limit(1);
        
    if (imageResults.length === 0) return null;

    return {
        id: imageResults[0].id,
        url: await getListingImageUrl(imageResults[0].id),
    };
};

export const getListingAllImages = async (listingId: string) => {
    const imageResults = await db.select()
        .from(listingImageTable)
        .where(eq(listingImageTable.listingId, listingId));

    return await Promise.all(imageResults.map(async (image) => ({
        id: image.id,
        url: await getListingImageUrl(image.id),
    })));
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