<script lang="ts">
import type { Snippet } from "svelte";

const {
    children,
    onClick,
}: {
    children: Snippet,
    onClick: () => void,
} = $props();
</script>

<button onclick={onClick}>
    {@render children()}
</button>

<style lang="scss">
button {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>