import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getLivestreamList = apiGetter<Endpoint>("livestream/list", true);