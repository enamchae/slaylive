import type { User } from "@supabase/supabase-js";
import { error, type RequestHandler } from "@sveltejs/kit";

export const requiresLoggedInUser = (handle: (event: Parameters<RequestHandler>[0], user: User) => ReturnType<RequestHandler>): RequestHandler => 
    async event => {
        const {request, locals: {supabase}} = event;

        const authorization = request.headers.get("Authorization");
        if (authorization === null) return error(400, "No authorization token given");

        const token = authorization.split(" ")[1]
        const userResponse = await supabase.auth.getUser(token);
        if (userResponse.error !== null) return error(401, "No user found");

        return handle(event, userResponse.data.user);
    };