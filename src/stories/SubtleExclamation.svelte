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
    letter-spacing: 10%;
}
</style>
