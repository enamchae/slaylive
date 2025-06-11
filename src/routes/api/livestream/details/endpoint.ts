import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getLivestreamDetails = apiGetter<Endpoint>("/api/livestream/details", true);