import type { User } from "@supabase/supabase-js";
import { error, json, type RequestHandler } from "@sveltejs/kit";

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




export class GetEndpoint<T=null, Payload extends Record<string, string>=any, Output=any> {
    constructor(
        private readonly handle: (
            payload: Payload,
            data: T,
            ...args: Parameters<RequestHandler>
        ) => ReturnType<RequestHandler> | Promise<Output>,
    ) {}

    async callHandler(data: T, ...[event, ...args]: Parameters<RequestHandler>): Promise<Response> {
        const out = await this.handle(Object.fromEntries(event.url.searchParams) as Payload, data, event, ...args);
        if (out instanceof Response) {
            return out;
        }
        
        return json(out);
    }
    
    handler(data: T): RequestHandler {
        return (...args) => this.callHandler(data, ...args);
    }
}

export class PostEndpoint<T=null, Payload extends Record<string, any>=any, Output=any> {
    constructor(
        private readonly handle: (
            payload: Payload,
            data: T,
            ...args: Parameters<RequestHandler>
        ) => ReturnType<RequestHandler> | Promise<Output>,
    ) {}

    async callHandler(data: T, ...[event, ...args]: Parameters<RequestHandler>): Promise<Response> {
        const out = await this.handle((await event.request.json()) as Payload, data, event, ...args);
        if (out instanceof Response) {
            return out;
        }
        
        return json(out);
    }
    
    handler(data: T): RequestHandler {
        return (...args) => this.callHandler(data, ...args);
    }
}