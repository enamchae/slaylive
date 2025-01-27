<script lang="ts">
import Watch from "$stories/Watch.svelte";
import {store} from "$routes/store.svelte";
    import { onMount } from "svelte";

let callId = $state<string | null>(null);
onMount(() => {
    callId = new URLSearchParams(location.search).get("call_id") ?? null;
});
</script>

{#if callId !== null && store.user !== null}
    <Watch
        {callId}
        userToken={store.user.streamioAuth.token}
        userId={store.user.streamioAuth.id}
        userName={store.user.streamioAuth.name}
    />
{/if}