<script lang="ts">
import Watch from "$stories/Watch.svelte";
import {store} from "$routes/store.svelte";
    import { onMount } from "svelte";

let callId = $state<string | null>(null);
onMount(() => {
    callId = new URLSearchParams(location.search).get("call_id") ?? null;
});
</script>

{#if callId !== null && store.userId !== null && store.userToken !== null && store.userName !== null}
    <Watch
        {callId}
        userToken={store.userToken}
        userId={store.userId}
        userName={store.userName}
    />
{/if}