<script lang="ts">
    import { apiFetchAuthenticated } from "$routes/util";
    import Button from "@/Button.svelte";
    import { fetchStreamData, streamState } from "../store.svelte";
    import { store } from "$routes/store.svelte";
    import ParticipantVideo from "@/stream/ParticipantVideo.svelte";
    import StreamViewerInteraction from "@/stream/interaction/StreamViewerInteraction.svelte";
    import { StreamVideoClient, type Call, type StreamVideoParticipant, type User } from "@stream-io/video-client";
    import { PUBLIC_STREAM_API_KEY } from "$env/static/public";
    import { onDestroy } from "svelte";
    import { LivestreamEventType, type LivestreamEvent } from "@/stream/interaction/CallEvent";



let waiting = $state(false);

let streamData = $state<{
    active: boolean
} | null>(null);

const streamId = $derived(streamState().id);

$effect(() => {
    (async () => {
        const data = await fetchStreamData(streamId);

        streamData = {
            active: data.active,
        };
    })();
});

    
const startLivestream = async () => {
    if (streamData === null) return;

    waiting = true;

    await apiFetchAuthenticated("livestream/start", {
        method: "POST",
        body: JSON.stringify({
            livestreamId: streamId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    waiting = false;
    streamData.active = true;
};


const stopLivestream = async () => {
    if (streamData === null) return;

    waiting = true;

    await apiFetchAuthenticated("livestream/stop", {
        method: "POST",
        body: JSON.stringify({
            livestreamId: streamId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    waiting = false;
    streamData.active = false;
};

// set up the user object
let user = $derived(
    store.user === null
        ? null
        : <User>{
            id: store.user.streamioAuth.id,
            name: store.user.name,
            image: `https://getstream.io/random_svg/?id=${store.user.streamioAuth.id}&name=${store.user.name}`,
        }
);

let nParticipants = $state(0);
let started = $state(false);

let call = $state<Call | null>(null);
let localParticipant = $state<StreamVideoParticipant | null>(null);

(async () => {
    if (streamId === null || store.user === null || user === null) return;

    const client = new StreamVideoClient({
        apiKey: PUBLIC_STREAM_API_KEY,
        token: store.user.streamioAuth.token,
        user,
    });
    call = client.call('livestream', streamId);

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
                livestreamId: streamId,
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



{#if streamData !== null && store.user !== null}
    <button-row>
        <Button
            onClick={() => startLivestream()}
            disabled={streamData.active || waiting}
            strong
        >Open room</Button>

        <Button
            onClick={() => stopLivestream()}
            disabled={!streamData.active || waiting}
        >Close room</Button>
    </button-row>
    
    <button-row>
        <Button
            onClick={() => call?.goLive()}
            disabled={!streamData.active || waiting || started}
            strong
        >Start broadcast</Button>

        <Button
            onClick={() => call?.stopLive()}
            disabled={!streamData.active || waiting || !started}
        >Stop broadcast</Button>
    </button-row>

    {#if streamId !== null}
        <backstage-container>
            <div>
                {#if nParticipants === 0}
                    Loading call
                {:else}
                    {nParticipants - 1} viewers
                {/if}
            </div>

            {#if call !== null}
                {#if localParticipant !== null}
                    <ParticipantVideo
                        {call}
                        sessionId={localParticipant.sessionId}
                    />
                {/if}

                <StreamViewerInteraction
                    userId={store.user.streamioAuth.id}
                    userName={store.user.name}
                    {call}
                />
            {/if}
        </backstage-container>
    {/if}
{/if}


<style lang="scss">
button-row {
    display: flex;
    justify-content: center;
}

backstage-container {
    display: flex;
    flex-direction: column;
}
</style>