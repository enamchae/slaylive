import { store } from "./store.svelte";

import { PUBLIC_API_URL } from "$env/static/public";

const authHeader = () => {
    if (store.user === null) throw new TypeError("Not logged in");
    return `Bearer ${store.user.supabaseAccessToken}`;
};

const handleResponse = async <T>(response: Response) => {
    if (!response.ok) {
        throw new Error(`${response.url} | ${response.status} ${response.statusText} | ${(await response.json()).message}`);
    }
    return (await response.json()) as T;
};

const apiUrl = (path: URL | string) => new URL(path, PUBLIC_API_URL);

export const apiFetch = async <T>(path: URL | string, options?: RequestInit) => await handleResponse<T>(await fetch(apiUrl(path), options));
export const apiFetchAuthorized = async <T>(path: URL | string, options?: RequestInit) => {
    const request = new Request(apiUrl(path), options);
    request.headers.set("Authorization", authHeader());
    return await handleResponse<T>(await fetch(request));
};