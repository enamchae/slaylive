import { apiPoster } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const login = apiPoster<Endpoint>("user/login", false);