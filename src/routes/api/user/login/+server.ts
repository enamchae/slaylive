import type { UserRequest } from "@stream-io/node-sdk";
import { error, type RequestHandler } from "@sveltejs/kit";

import {client} from "$api/global"

export const POST: RequestHandler = async ({locals: {user}}) => {
    if (user === null) return error(401, "Not logged in");

    const userName = user.id;

    const streamUser: UserRequest = {
        id: user.id,
        role: "admin",
        name: userName,
    }; 

    await client.upsertUsers([streamUser]);

    const userToken = client.generateUserToken({user_id: user.id});

    return new Response(JSON.stringify({
        userId: user.id,
        userName,
        userToken,
    }));
};