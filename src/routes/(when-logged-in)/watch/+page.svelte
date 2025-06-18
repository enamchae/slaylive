<script lang="ts">
import Watch from "./Watch.svelte";
import {store} from "$routes/store.svelte";
    import { onMount } from "svelte";

let streamId = $state<string | null>(null);
onMount(() => {
    streamId = new URLSearchParams(location.search).get("streamId") ?? null;
});
</script>

<main>
    {#if streamId !== null && store.user !== null}
        <Watch
            {streamId}
            userToken={store.user.streamioAuth.token}
            userId={store.user.streamioAuth.id}
            userName={store.user.streamioAuth.name}
        />
    {/if}
</main>

<style lang="scss">
main {
    flex-grow: 1;
    overflow-y: auto;
    position: relative;
}
</style>