<script lang="ts">
import type { Snippet } from "svelte";

const {
    children,
}: {
    children: Snippet,
} = $props();
</script>

<subtle-exclamation>{@render children?.()}</subtle-exclamation>

<style lang="scss">
subtle-exclamation {
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.25ch;

    color: #000000af;
}
</style>
