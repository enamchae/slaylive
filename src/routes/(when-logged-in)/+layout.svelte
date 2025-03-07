<script lang="ts">
import Tabs from "$stories/Tabs.svelte";
import { store } from "$routes/store.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

let { children } = $props();

onMount(() => {
    if (store.user !== null) return;
    goto("/");
});
</script>

<main>
    {#if store.user !== null}
        {@render children()}
    {/if}
</main>

<Tabs />

<style lang="scss">
main {
    flex-grow: 1;
}
</style>