import type { RequestHandler } from "@sveltejs/kit";
import { client } from "../../global";

export const POST: RequestHandler = async ({request}) => {
    const {userId} = await request.json();

    const userToken = client.generateUserToken({user_id: userId});

    return new Response(JSON.stringify({
        userToken,
    }));
};