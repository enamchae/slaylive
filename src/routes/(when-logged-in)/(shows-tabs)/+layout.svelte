<script lang="ts">
import Tabs from "./Tabs.svelte";
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
    position: relative;
    flex-grow: 1;
    overflow-y: auto;
    padding: 0.5rem 1rem 0;

    mask: linear-gradient(#000 calc(100% - 4rem), #0000);
    padding-bottom: 4rem;
}
</style>
