import { api } from "./client";

// Export individual functions for backward compatibility
export const getListingDetails = api.listing.details;
export const getListingList = api.listing.list;
export const getListingsBySeller = api.listing.bySeller;
export const editListing = api.listing.edit;
export const newListing = api.listing.new;

export const getLivestreamList = api.stream.list;
export const getLivestreamHost = api.stream.getHost;
export const getStreamInfo = api.stream.details;
export const getLivestreamsBySeller = api.stream.bySeller;
export const newLivestream = api.stream.new;

export const editStreamDetails = api.stream.edit.details;
export const editStreamListingSelection = api.stream.edit.listing.selection;
export const editStreamListingPrice = api.stream.edit.listing.price;
export const editStreamListingActivation = api.stream.edit.listing.activation;

export const startLivestream = api.stream.start;
export const stopLivestream = api.stream.stop;
export const setStreamHostSession = api.stream.setHostSession;

// Aliases for backward compatibility
export const startStream = api.stream.start;
export const stopStream = api.stream.stop;

export const userLogin = api.user.login;

// Also export the main api object
export { api };
