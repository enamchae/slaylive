import type { GetEndpoint, PostEndpoint } from "$api/middleware";
import { apiFetch, apiFetchAuthenticated, apiUrl } from "$/routes/util";

export type PayloadOf<T> =
    T extends GetEndpoint<infer Payload, any> ? Payload :
    T extends PostEndpoint<infer Payload, any> ? Payload :
    never;
export type OutputOf<T> =
    T extends GetEndpoint<any, infer Output> ? Output :
    T extends PostEndpoint<any, infer Output> ? Output :
    never;


export const apiGetter = <T extends GetEndpoint>(urlString: string, authenticated: boolean) => {
    const url = apiUrl(urlString);

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



export const apiPoster = <T extends PostEndpoint>(urlString: string, authenticated: boolean, method: string="POST") => {
    const url = apiUrl(urlString);

    const doFetch = authenticated ? apiFetchAuthenticated : apiFetch; 

    return (
        payload: PayloadOf<T>,
        options?: RequestInit,
    ) => {
        const urlObj = new URL(url);

        return doFetch<OutputOf<T>>(urlObj, {
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            method,
            ...options,
        });
    };
};