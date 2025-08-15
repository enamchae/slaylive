import { apiGetter, apiPoster, apiFileUploader } from "./endpoint-client";
import type { GetListingsBySeller } from "./listing/by-seller/+server";
import type { GetListingDetails } from "./listing/details/+server";
import type { GetListingList } from "./listing/list/+server";
import type { GetLivestreamsBySeller } from "./livestream/by-seller/+server";
import type { GetStreamInfo } from "./livestream/details/+server";
import type { EditStreamDetails } from "./livestream/edit/details/+server";
import type { EditStreamListingActivation } from "./livestream/edit/listing-activation/+server";
import type { EditStreamListingPrice } from "./livestream/edit/listing-price/+server";
import type { EditStreamListingSelection } from "./livestream/edit/listing-selection/+server";
import type { GetLivestreamHost } from "./livestream/get-host/+server";
import type { GetLivestreamList } from "./livestream/list/+server";
import type { SetStreamHostSession } from "./livestream/set-host-session/+server";
import type { StartLivestream } from "./livestream/start/+server";
import type { StopLivestream } from "./livestream/stop/+server";
import type { UserLogin } from "./user/login/+server";
import type { UserEdit } from "./user/edit/+server";
import type { EditListing } from "./listing/edit/+server";
import type { NewListing } from "./listing/new/+server";
import type { NewLivestream } from "./livestream/new/+server";
import type { CreatePaymentIntent } from "./stripe/payment-intent/create/+server";
import type { CreateCustomer } from "./stripe/customer/create/+server";
import type { ListPaymentMethods } from "./stripe/payment-methods/list/+server";
import type { DeletePaymentMethod } from "./stripe/payment-methods/delete/+server";
import type { CreateCheckoutSession } from "./stripe/checkout/session/+server";
import type { UploadListingImage } from "./listing/image/upload/+server";
import type { DeleteListingImage } from "./listing/image/delete/+server";


export const api = {
    listing: {
        bySeller: apiGetter<GetListingsBySeller>("listing/by-seller", true),
        details: apiGetter<GetListingDetails>("listing/details", true),
        list: apiGetter<GetListingList>("listing/list", true),
        edit: apiPoster<EditListing>("listing/edit", true, "PATCH"),
        new: apiPoster<NewListing>("listing/new", true, "PUT"),
        image: {
            upload: apiFileUploader<UploadListingImage>("listing/image/upload", true),
            delete: apiPoster<DeleteListingImage>("listing/image/delete", true, "DELETE"),
        },
    },
    stream: {
        bySeller: apiGetter<GetLivestreamsBySeller>("livestream/by-seller", true),
        details: apiGetter<GetStreamInfo>("livestream/details", true),
        getHost: apiGetter<GetLivestreamHost>("livestream/get-host", true),
        list: apiGetter<GetLivestreamList>("livestream/list", true),
        new: apiPoster<NewLivestream>("livestream/new", true, "PUT"),
        start: apiPoster<StartLivestream>("livestream/start", true),
        stop: apiPoster<StopLivestream>("livestream/stop", true),
        setHostSession: apiPoster<SetStreamHostSession>("livestream/set-host-session", true, "PATCH"),
        edit: {
            details: apiPoster<EditStreamDetails>("livestream/edit/details", true, "PATCH"),
            listing: {
                selection: apiPoster<EditStreamListingSelection>("livestream/edit/listing-selection", true, "PATCH"),
                price: apiPoster<EditStreamListingPrice>("livestream/edit/listing-price", true, "PATCH"),
                activation: apiPoster<EditStreamListingActivation>("livestream/edit/listing-activation", true, "PATCH"),
            },
        },
    },
    user: {
        login: apiPoster<UserLogin>("user/login", false),
        edit: apiPoster<UserEdit>("user/edit", true),
    },
    stripe: {
        paymentIntent: {
            create: apiPoster<CreatePaymentIntent>("stripe/payment-intent/create", true),
        },
        customer: {
            create: apiPoster<CreateCustomer>("stripe/customer/create", true),
        },
        paymentMethods: {
            list: apiPoster<ListPaymentMethods>("stripe/payment-methods/list", true),
            delete: apiPoster<DeletePaymentMethod>("stripe/payment-methods/delete", true, "DELETE"),
        },
        checkout: {
            session: apiPoster<CreateCheckoutSession>("stripe/checkout/session", true),
        },
    },
};