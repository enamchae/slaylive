<script lang="ts">
    import type { Call } from "@stream-io/video-client";
    import Chat from "./Chat.svelte";
    import Reactions from "./Reactions.svelte";

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

<stream-interaction>
    <Chat
        {userId}
        {userName}
        {call}
    />
    
    <Reactions
        {call}
    />
</stream-interaction>