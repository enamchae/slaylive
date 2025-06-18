<script lang="ts">
import Tabs from "./Tabs.svelte";
import { type Snippet } from "svelte";
    
const {
    children,
}: {
    children: Snippet,
} = $props();
</script>

<page-content>
    {@render children()}
</page-content>

<Tabs />

<style lang="scss">
page-content {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
</style>