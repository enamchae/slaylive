import { apiFetch, apiFetchAuthenticated, apiUrl } from "$routes/util";
import type { GetEndpoint, OutputOf, PayloadOf, PostEndpoint, FilePostEndpoint } from "./endpoint-server";

export const apiGetter = <T extends GetEndpoint<any>>(urlString: string, authenticated: boolean) => {
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



export const apiPoster = <T extends PostEndpoint<any>>(urlString: string, authenticated: boolean, method: string="POST") => {
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

export const apiFileUploader = <T extends FilePostEndpoint<any>>(urlString: string, authenticated: boolean, method: string="POST") => {
    const url = apiUrl(urlString);

    const doFetch = authenticated ? apiFetchAuthenticated : apiFetch; 

    return (
        payload: PayloadOf<T>,
        options?: RequestInit,
    ) => {
        const urlObj = new URL(url);
        
        // Convert payload to FormData
        const formData = new FormData();
        for (const [key, value] of Object.entries(payload)) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        }

        return doFetch<OutputOf<T>>(urlObj, {
            body: formData,
            method,
            ...options,
        });
    };
};