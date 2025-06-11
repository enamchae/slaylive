import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getLivestreamHost = apiGetter<Endpoint>("/api/livestream/get-host", true);