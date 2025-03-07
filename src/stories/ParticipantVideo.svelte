<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { type Call } from "@stream-io/video-client";


const {
    call,
    sessionId,
    isBackdrop = false,
    hasShadow = false,
}: {
    call: Call,
    sessionId: string,
    isBackdrop?: boolean,
    hasShadow?: boolean,
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

<video
    bind:this={video}
    class:backdrop={isBackdrop}
    class:shadow={hasShadow}
></video>

<style lang="scss">
video {
    width: 100%;
    height: 100%;

    &.backdrop {
        object-fit: cover;
        filter: brightness(.5) blur(32px);
    }

    &:not(.backdrop) {
        filter: blur(0);
    }

    &.shadow {
        box-shadow: 0 0 128px #000;
    }
}
</style>