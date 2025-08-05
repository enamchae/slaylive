<script lang="ts">
import { store } from "$routes/store.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

let { children } = $props();

onMount(() => {
    if (store.user === null) {
        goto("/");
        return;
    }
});
</script>

{#if store.user !== null}
    {@render children()}
{/if}