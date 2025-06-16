import { apiGetter } from "$/lib/endpoint-typing";
import type { Endpoint } from "./+server";

export const getListingsBySeller = apiGetter<Endpoint>("listing/by-seller", true);