<script lang="ts">
    import { apiFetchAuthenticated } from "$routes/util";
    import Button from "@/Button.svelte";
    import { streamState } from "../store.svelte";
    import { store } from "$routes/store.svelte";
    import ParticipantVideo from "@/stream/ParticipantVideo.svelte";
    import StreamViewerInteraction from "@/stream/interaction/StreamViewerInteraction.svelte";
    import { StreamVideoClient, type Call, type StreamVideoParticipant, type User } from "@stream-io/video-client";
    import { PUBLIC_STREAM_API_KEY } from "$env/static/public";
    import { onDestroy } from "svelte";
    import { LivestreamEventType, type LivestreamEvent } from "@/stream/interaction/CallEvent";
    import { startStream, stopStream } from "$api/api";



let waiting = $state(false);

const streamData = $derived(streamState().data);
const streamId = $derived(streamState().id);
const callData = $derived(streamState().callData);

    
const startLivestream = async () => {
    if (streamId === null) return;

    waiting = true;
    
    await startStream({
        livestreamId: streamId,
    });

    waiting = false;
    streamData.active = true;
};


const stopLivestream = async () => {
    if (streamId === null) return;

    waiting = true;

    await stopStream({
        livestreamId: streamId,
    });

    waiting = false;
    streamData.active = false;
};


const updateListingState = async (
    listing: {
        id: string,
        name: string,
        desc: string,
        imageUrls: string[],
    },
) => {
    if (callData === null) return;

    await callData.call.sendCustomEvent({
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



{#if streamData !== null && callData !== null && store.user !== null}
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
            onClick={() => callData.call.goLive()}
            disabled={waiting || callData.started}
            strong
        >Start broadcast</Button>

        <Button
            onClick={() => callData.call.stopLive()}
            disabled={waiting || !callData.started}
        >Stop broadcast</Button>
    </button-row>

    {#if streamId !== null}
        <backstage-container>
            <div>
                {#if callData.nParticipants === 0}
                    Loading call
                {:else}
                    {callData.nParticipants - 1} viewers
                {/if}
            </div>

            {#if callData.localParticipant !== null}
                <ParticipantVideo
                    call={callData.call}
                    sessionId={callData.localParticipant.sessionId}
                />
            {/if}

            <StreamViewerInteraction
                userId={store.user.streamioAuth.id}
                userName={store.user.name}
                call={callData.call}
            />
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