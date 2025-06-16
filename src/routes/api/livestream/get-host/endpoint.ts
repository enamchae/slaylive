import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getLivestreamHost = apiGetter<Endpoint>("livestream/get-host", true);