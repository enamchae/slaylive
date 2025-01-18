import type { UserRequest } from "@stream-io/node-sdk";
import type { RequestHandler } from "@sveltejs/kit";

import {client} from "$api/global"

export const PUT: RequestHandler = async ({request}) => {
    const userId = crypto.randomUUID();
    const userName = userId;

    const streamUser: UserRequest = {
        id: userId,
        role: "admin",
        name: userName,
    };

    await client.upsertUsers([streamUser]);
    
    return new Response(JSON.stringify({
        userId,
        userName,
    }));
};