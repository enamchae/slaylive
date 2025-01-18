<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { type Call } from "@stream-io/video-client";

const {
    call,
    sessionId,
}: {
    call: Call,
    sessionId: string,
} = $props();

let destroy = $state<(() => void) | null>(null);
let video = $state<HTMLVideoElement | null>(null);

onMount(() => {
    if (video === null) return;

    destroy = call.bindVideoElement(video, sessionId, "videoTrack") ?? null;
});

onDestroy(() => {
    destroy?.();
});
</script>

<video bind:this={video}></video>