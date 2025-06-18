<script lang="ts">
    import type { Snippet } from "svelte";

const {
    children,
}: {
    children: Snippet
} = $props();
</script>

<page-scroller>
    {@render children()}
</page-scroller>


<style lang="scss">
page-scroller {
    position: relative;
    flex-grow: 1;
    overflow-y: auto;

    mask: linear-gradient(#0000, #000 calc(2rem), #000 calc(100% - 2rem), #0000);
    padding: 2rem 0;
}
</style>