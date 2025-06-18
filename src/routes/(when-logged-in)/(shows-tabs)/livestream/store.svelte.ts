import { getLivestreamDetails } from "$api/api";
import { goto } from "$app/navigation";

let id = $state<string | null>(null);

export const editStream = (newId: string) => {
    id = newId;

    goto(`/livestream`);
};

export const setStreamId = (newId: string) => {
    id = newId;
};

export const fetchStreamData = (streamId: string | null) => {
    if (streamId === null) {
        return Promise.resolve({title: "", description: "", active: false, listings: []});
    }

    return getLivestreamDetails({
        livestreamId: streamId,
    });
};


const state = $derived({
    id,
});
export const streamState = () => state;
