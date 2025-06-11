import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getListingList = apiGetter<Endpoint>("/api/listing/list", true);