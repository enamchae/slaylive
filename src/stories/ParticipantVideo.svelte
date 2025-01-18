<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { type Call, type StreamVideoParticipant } from "@stream-io/video-client";

const {
    call,
    participant,
}: {
    call: Call,
    participant: StreamVideoParticipant,
} = $props();

let destroy = $state<(() => void) | null>(null);
let video = $state<HTMLVideoElement | null>(null);

onMount(() => {
    if (video === null) return;

    destroy = call.bindVideoElement(video, participant.sessionId, "videoTrack") ?? null;
});

onDestroy(() => {
    destroy?.();
});
</script>

<video bind:this={video}></video>