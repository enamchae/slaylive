import { db } from "./db";
import { listingImageTable, listingTable } from "./db/schema";
import { and, eq, or } from "drizzle-orm";
import { getListingAllImages, getListingFirstImage, getListingImageUrl } from "./listing-image";
import type { User } from "@supabase/supabase-js";

export type ListingWithImages = {
    id: string;
    title: string;
    description: string;
    sellerUserId: string;
    images: {
        id: string;
        url: string;
    }[];
    onDisplay?: boolean;
    price?: number;
};

export const augmentListingWithFirstImage = async (listingId: string): Promise<ListingWithImages> => {
    const listing = await db.select()
        .from(listingTable)
        .where(eq(listingTable.id, listingId))
        .limit(1);
        
    if (listing.length === 0) throw new Error(`Listing ${listingId} not found`);

    const image = await getListingFirstImage(listingId);

    return {
        ...listing[0],
        images: image !== null ? [image] : [],
    };
};

/**
 * Fetch all listings that are either on display or belong to the current user
 */
export const listListingsWithSingleImage = async (user: User): Promise<ListingWithImages[]> => {
    const listings = await db.select({
        id: listingTable.id,
        title: listingTable.title,
        description: listingTable.description,
        sellerUserId: listingTable.sellerUserId,
        onDisplay: listingTable.onDisplay,
    })
        .from(listingTable)
        .where(
            or(
                listingTable.onDisplay,
                eq(listingTable.sellerUserId, user.id),
            ),
        );

    return await Promise.all(listings.map(listing => augmentListingWithFirstImage(listing.id)));
};

/**
 * Fetch listings by a specific seller
 */
export const fetchListingsBySeller = async (sellerUserId: string): Promise<ListingWithImages[]> => {
    const listings = await db.select({
        id: listingTable.id,
        title: listingTable.title,
        description: listingTable.description,
        sellerUserId: listingTable.sellerUserId,
        onDisplay: listingTable.onDisplay,
    })
        .from(listingTable)
        .where(eq(listingTable.sellerUserId, sellerUserId));

    return await Promise.all(listings.map(listing => augmentListingWithFirstImage(listing.id)));
};

/**
 * Fetch a single listing by ID with permission check
 */
export const getListingDetails = async (listingId: string, user: User): Promise<ListingWithImages | null> => {
    const listings = await db.select({
        id: listingTable.id,
        title: listingTable.title,
        description: listingTable.description,
        onDisplay: listingTable.onDisplay,
        sellerUserId: listingTable.sellerUserId,
    })
        .from(listingTable)
        .where(eq(listingTable.id, listingId))
        .limit(1);

    if (listings.length === 0) return null;

    const listing = listings[0];
    
    // Check permissions
    if (!listing.onDisplay && listing.sellerUserId !== user.id) {
        return null;
    }

    const images = await getListingAllImages(listingId);

    return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        sellerUserId: listing.sellerUserId,
        onDisplay: listing.onDisplay,
        images,
    };
};
