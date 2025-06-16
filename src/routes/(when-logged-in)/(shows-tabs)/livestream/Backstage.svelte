<script lang="ts">
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant } from "@stream-io/video-client";

import { PUBLIC_STREAM_API_KEY } from "$env/static/public";
import ParticipantVideo from "@/ParticipantVideo.svelte";
import { apiFetchAuthenticated } from "$routes/util";
import { onDestroy } from "svelte";
    import { type LivestreamEvent, LivestreamEventType } from "@/CallEvent";
    import Chat from "@/Chat.svelte";
    import Reactions from "@/Reactions.svelte";
    import type { getListingsBySeller } from "$api/listing/by-seller/endpoint";
    import Button from "$/lib/components/Button.svelte";

let {
    userToken,
    userId,
    userName,
    livestreamId,
}: {
    userToken: string,
    userId: string,
    userName: string,
    livestreamId: string,
} = $props();

// set up the user object
let user: User = $derived({
    id: userId,
    name: userName,
    image: `https://getstream.io/random_svg/?id=${userId}&name=${userName}`,
});

let nParticipants = $state(0);
let started = $state(false);

let call = $state<Call | null>(null);
let localParticipant = $state<StreamVideoParticipant | null>(null);

(async () => {

    const client = new StreamVideoClient({ apiKey: PUBLIC_STREAM_API_KEY, token: userToken, user });
    call = client.call('livestream', livestreamId);

    await call.join();
    
    try {
        await Promise.all([
            call.camera.enable(),
            call.microphone.enable(),
        ]);
    } catch (error) {
        alert(`Camera is inaccessible or permission was denied: ${error}`);
        return;
    }

    // Render local participant's video
    call.state.localParticipant$.subscribe(participant => {
        if (!participant) return;

        localParticipant = participant;

        apiFetchAuthenticated("livestream/set-host-session", {
            method: "PATCH",
            body: JSON.stringify({
                livestreamId,
                sessionId: participant.sessionId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    // Render the number of users who joined
    call.state.participantCount$.subscribe((count) => {
        nParticipants = count || 0;
    });

    call.state.backstage$.subscribe((backstage) => {
        started = !backstage;
    });
})();

onDestroy(() => {
    call?.leave();
});


const updateListingState = async (
    listing: {
        id: string,
        name: string,
        desc: string,
        imageUrls: string[],
    },
) => {
    if (call === null) return;

    await call.sendCustomEvent({
        type: LivestreamEventType.UpdateListing,
        data: {
            listing: {
                id: listing.id,
                price: 125,
                name: listing.name,
                desc: listing.desc,
                images: listing.imageUrls,
            },
        },
    } satisfies LivestreamEvent<LivestreamEventType.UpdateListing>);
};
</script>

<backstage-container>
    <div>Livestream id: {livestreamId}</div>
    <div>Live: {nParticipants}</div>
    {#if call !== null}
        {#if localParticipant !== null}
            <ParticipantVideo
                {call}
                sessionId={localParticipant.sessionId}
            />
        {/if}
    
        <start-stop-broadcast>
            <Button
                onClick={() => call?.goLive()}
                disabled={started}
            >Start broadcast</Button>

            <Button
                onClick={() => call?.stopLive()}
                disabled={!started}
            >Stop broadcast</Button>
        </start-stop-broadcast>

        <Chat
            {userId}
            {userName}
            {call}
        />
        
        <Reactions
            {call}
        />
    {/if}
</backstage-container>

<style lang="scss">
backstage-container {
    display: flex;
    flex-direction: column;
}

video {
    object-fit: contain;
}
</style>