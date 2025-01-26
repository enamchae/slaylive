import {PUBLIC_API_URL} from "$env/static/public";

export const fetchApi = async (path: URL | string, options: RequestInit) =>
    await (await fetch(new URL(path, PUBLIC_API_URL), options)).json();