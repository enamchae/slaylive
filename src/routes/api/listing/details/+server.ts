import { db } from "$/lib/server/db";
import { listingImageTable, listingTable } from "$/lib/server/db/schema";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { GetEndpoint, requiresLoggedInUser } from "../../middleware";
import type { User } from "@supabase/supabase-js";
import {supabaseServerClient} from "$lib/server/supabase";


const get = new GetEndpoint(
    async (payload: {
        listingId: string,
    }, {user}: {user: User}) => {
        const listings = await db.select({
            title: listingTable.title,
            description: listingTable.description,
            onDisplay: listingTable.onDisplay,
            sellerUserId: listingTable.sellerUserId,
        })
            .from(listingTable)
            .where(eq(listingTable.id, payload.listingId))
            .limit(1);

        if (listings.length === 0) return error(404, "No listing found");

        const listingObj = listings[0];
        if (listingObj.onDisplay === false && listingObj.sellerUserId !== user.id) return error(404, "No listing found");

        const images = await db.select()
            .from(listingImageTable)
            .where(eq(listingImageTable.listingId, payload.listingId));

        const imagesWithUrls = await Promise.all(images.map(async (image) => {
            const imageUrl = `public/${image.id}`;
            const publicUrl = await supabaseServerClient
                .storage
                .from("listing-images")
                .createSignedUrl(imageUrl, 60 * 60 * 24);

            return {
                id: image.id,
                url: publicUrl,
            };
        }));

        return {
            title: listingObj.title,
            description: listingObj.description,
            onDisplay: listingObj.onDisplay,
            images: imagesWithUrls,
        };
    },
);

export const GET = requiresLoggedInUser((user, event) => get.callHandler({user}, event));
export type GetListingDetails = typeof get;
