import { getLivestreamDetails } from "$api/api";
import { goto } from "$app/navigation";
import type { Call, StreamVideoParticipant } from "@stream-io/video-client";

let id = $state<string | null>(null);

export const editStream = (newId: string) => {
    id = newId;

    resetStreamData();

    goto(`/livestream`);
};

export const setStreamId = (newId: string) => {
    id = newId;
};


let data = $state<{
    title: string,
    description: string,
    active: boolean,
    listings: {
        id: string,
    }[],
}>({
    title: "",
    description: "",
    active: false,
    listings: [],
});


export const resetStreamData = () => {
    data = {title: "", description: "", active: false, listings: []};

    
    if (id === null) return;

    (async () => {
        const newStreamData = await getLivestreamDetails({
            livestreamId: id,
        });

        data = {
            title: newStreamData.title,
            description: newStreamData.description,
            active: newStreamData.active,
            listings: newStreamData.listings,
        };
    })();
};


type CallData = {
    call: Call,
    nParticipants: number,
    started: boolean,
    localParticipant: StreamVideoParticipant | null,
};

let callData = $state<CallData | null>(null);

export const setCallData = (newCallData: CallData) => {
    callData = newCallData;
};

export const assignCallData = (newCallData: Partial<CallData>) => {
    if (callData === null) return;

    Object.assign(callData, newCallData);
};


const state = $derived({
    id,
    data,
    callData,
});
export const streamState = () => state;
