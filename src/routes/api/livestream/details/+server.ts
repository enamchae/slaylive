import { db } from "$/lib/server/db";
import { streamTable, streamListingAssociationTable, listingTable, listingImageTable } from "$/lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";
import { getListingImageUrl } from "$/lib/server/listing-image";


const get = new GetEndpoint(
    async (payload: {
        streamId: string,
    }) => {
        // if (livestreamId === null) return error(400, "Missing livestream id");

        const livestreams = await db.select({
            id: streamTable.id,
            title: streamTable.title,
            description: streamTable.description,
            hostUserId: streamTable.hostUserId,
            active: streamTable.active,
        })
            .from(streamTable)
            .where(eq(streamTable.id, payload.streamId))
            .limit(1);

        if (livestreams.length === 0) return error(404, "No livestream found");

        const livestreamObj = livestreams[0];


        const listingsData = await db.select({
            id: streamListingAssociationTable.listingId,
            title: listingTable.title,
            description: listingTable.description,
            price: streamListingAssociationTable.price,
            active: streamListingAssociationTable.active,
            imageId: listingImageTable.id,
        })
            .from(streamListingAssociationTable)
            .where(eq(streamListingAssociationTable.streamId, payload.streamId))
            .innerJoin(
                listingTable,
                eq(streamListingAssociationTable.listingId, listingTable.id),
            )
            .leftJoin(
                listingImageTable,
                eq(listingTable.id, listingImageTable.listingId),
            );

        // Group listings by ID and collect their images
        const listingsMap = new Map<string, any>();
        
        for (const listing of listingsData) {
            if (!listingsMap.has(listing.id)) {
                listingsMap.set(listing.id, {
                    id: listing.id,
                    title: listing.title,
                    description: listing.description,
                    price: listing.price,
                    active: listing.active,
                    images: [],
                });
            }

            const listingObj = listingsMap.get(listing.id)!;
            
            if (listing.imageId && !listingObj.images.some((img: any) => img.id === listing.imageId)) {
                const imageUrl = await getListingImageUrl(listing.imageId);
                listingObj.images.push({
                    id: listing.imageId,
                    url: imageUrl,
                });
            }
        }

        const listings = [...listingsMap.values()];

        return {
            id: livestreamObj.id,
            title: livestreamObj.title,
            description: livestreamObj.description,
            hostUserId: livestreamObj.hostUserId,
            active: livestreamObj.active,
            listings,
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler(null, event));
export type GetStreamInfo = typeof get;