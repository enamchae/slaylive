<script lang="ts">
    import Button from "@/Button.svelte";
    import { streamState } from "../store.svelte";
    import { store } from "$routes/store.svelte";
    import ParticipantVideo from "@/stream/ParticipantVideo.svelte";
    import StreamViewerInteraction from "@/stream/interaction/StreamViewerInteraction.svelte";
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