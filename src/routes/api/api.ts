import { apiGetter, apiPoster } from "$/lib/endpoint-typing";
import type { GetListingsBySeller } from "./listing/by-seller/+server";
import type { GetListingDetails } from "./listing/details/+server";
import type { GetListingList } from "./listing/list/+server";
import type { GetLivestreamsBySeller } from "./livestream/by-seller/+server";
import type { GetLivestreamDetails } from "./livestream/details/+server";
import type { GetLivestreamHost } from "./livestream/get-host/+server";
import type { GetLivestreamList } from "./livestream/list/+server";
import type { UserLogin } from "./user/login/+server";


export const getListingsBySeller = apiGetter<GetListingsBySeller>("listing/by-seller", true);
export const getListingDetails = apiGetter<GetListingDetails>("listing/details", true);
export const getListingList = apiGetter<GetListingList>("listing/list", true);
export const getLivestreamsBySeller = apiGetter<GetLivestreamsBySeller>("livestream/by-seller", true);
export const getLivestreamDetails = apiGetter<GetLivestreamDetails>("livestream/details", true);
export const getLivestreamHost = apiGetter<GetLivestreamHost>("livestream/get-host", true);
export const getLivestreamList = apiGetter<GetLivestreamList>("livestream/list", true);
export const userLogin = apiPoster<UserLogin>("user/login", false);
