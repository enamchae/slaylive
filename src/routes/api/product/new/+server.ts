import {type RequestHandler} from "@sveltejs/kit";
import {eq} from "drizzle-orm";

import { product } from "$/lib/server/db/schema";
import { db } from "$/lib/server/db";
import { requiresLoggedInUser } from "../../middleware";

export const PUT: RequestHandler = requiresLoggedInUser(async ({request}, user) => {
    const {productTitle, productDescription} = await request.json();

    const productId = await generateProductId();
    await db.insert(product)
        .values({
            id: productId,
            sellerUserId: user.id,
            title: productTitle,
            description: productDescription,
        });

    return new Response();
});

const generateProductId = async () => {
    let productId: string;
    while (true) {
        productId = crypto.randomUUID();

        const calls = await db.select({})
            .from(product)
            .where(eq(product.id, productId))
            .limit(1);
        if (calls.length === 0) break;
    }

    return productId;
};