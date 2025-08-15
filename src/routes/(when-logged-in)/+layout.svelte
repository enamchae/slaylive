<script lang="ts">
import { store } from "$routes/store.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { hasFinishedProfileSetup } from "$/lib/shared/user-utils";

let { children } = $props();

onMount(() => {
    if (store.user === null) {
        goto("/");
        return;
    }

    if (!store.user.hasFinishedProfileSetup) {
        goto("/onboarding/name");
        return;
    }
});
</script>

{#if store.user !== null && store.user.hasFinishedProfileSetup}
    {@render children()}
{/if}