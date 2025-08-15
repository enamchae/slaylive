import type { User } from "@supabase/supabase-js";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GetEndpoint, PostEndpoint, FilePostEndpoint } from "./endpoint-server";

export const requiresLoggedInUser = (handle: (user: User, ...args: Parameters<RequestHandler>) => ReturnType<RequestHandler>): RequestHandler => 
    async (event, ...args) => {
        const {request, locals: {supabase}} = event;

        const authorization = request.headers.get("Authorization");
        if (authorization === null) return error(400, "No authorization token given");

        const token = authorization.split(" ")[1]
        const userResponse = await supabase.auth.getUser(token);
        if (userResponse.error !== null) return error(401, "No user found");

        return handle(userResponse.data.user, event, ...args);
    };

// Re-export endpoint classes for convenience
export { GetEndpoint, PostEndpoint, FilePostEndpoint };



