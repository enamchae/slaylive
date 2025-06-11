import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getLivestreamsBySeller = apiGetter<Endpoint>("/api/livestream/by-seller", true);