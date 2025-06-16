import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getListingDetails = apiGetter<Endpoint>("listing/details", true);