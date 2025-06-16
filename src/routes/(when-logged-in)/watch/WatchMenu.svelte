<script lang="ts">
import type { Call } from "@stream-io/video-client";
import StreamViewerInteraction from "@/stream/interaction/StreamViewerInteraction.svelte";

const {
    userId,
    userName,
    call,
}: {
    userId: string,
    userName: string,
    call: Call,
} = $props();
</script>

<watch-menu>
    <StreamViewerInteraction
        {userId}
        {userName}
        {call}
    />
</watch-menu>