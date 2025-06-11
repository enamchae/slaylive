import type { User } from "@supabase/supabase-js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

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


export class GetEndpoint<Payload extends Record<string, string>=any, Output=any> {
    constructor(
        private readonly validatePayload: (searchParams: URLSearchParams, ...args: Parameters<RequestHandler>) => Awaited<ReturnType<RequestHandler>> | Payload,
        private readonly handle: (payload: Payload, ...args: Parameters<RequestHandler>) => ReturnType<RequestHandler> | Promise<Output>,
    ) {}
    
    handler(): RequestHandler {
        return async (event, ...args) =>{
            const payload = this.validatePayload(event.url.searchParams, event, ...args);
            if (payload instanceof Response) {
                return payload;
            }

            const out = await this.handle(payload, event, ...args);
            if (out instanceof Response) {
                return out;
            }
            
            return json(out);
        };
    }
}