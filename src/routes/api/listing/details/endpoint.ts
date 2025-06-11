import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getListingDetails = apiGetter<Endpoint>("/api/listing/details", true);