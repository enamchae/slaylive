import type { GetEndpoint } from "$/routes/api/middleware";
import { apiFetch, apiFetchAuthenticated } from "$/routes/util";

export type PayloadOf<T> = T extends GetEndpoint<infer Payload, any> ? Payload : never;
export type OutputOf<T> = T extends GetEndpoint<any, infer Output> ? Output : never;


export const apiGetter = <T extends GetEndpoint>(urlString: string, authenticated: boolean) => {
    const url = new URL(urlString, location.origin);

    const doFetch = authenticated ? apiFetchAuthenticated : apiFetch; 

    return (
        payload: PayloadOf<T>,
        options?: RequestInit,
    ) => {
        const urlObj = new URL(url);
        for (const [key, value] of Object.entries(payload as Record<string, string>)) {
            urlObj.searchParams.set(key, value);
        }

        return doFetch<OutputOf<T>>(urlObj, options);
    };
};