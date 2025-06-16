<script lang="ts">
    import Button from "@/Button.svelte";
import type { Snippet } from "svelte";

const {
    heading,
    children,
    hasBackButton,
}: {
    heading: string,
    children: Snippet,
    hasBackButton?: boolean,
} = $props();
</script>

<tabbed-page>
    <page-heading>
        {#if hasBackButton}
            <button
                onclick={() => history.back()}
            >&lt;</button>
        {/if}

        <h1>{heading}</h1>
    </page-heading>

    {@render children()}
</tabbed-page>

<style lang="scss">
tabbed-page {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

page-heading {
    display: flex;
    padding: 0.5rem 1rem;
}

button {
    border: none;
    background: none;
    padding: 1rem;
}
</style>