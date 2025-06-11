<script lang="ts">
import type { Snippet } from "svelte";

const {
    isCreatePlaceholder = false,
    onClick,
    children,
}: {
    isCreatePlaceholder?: boolean,
    onClick: () => void,
    children?: Snippet
} = $props();
</script>

<listing-thumbnail
    class:is-create-placeholder={isCreatePlaceholder}
    onclick={onClick}
    tabindex="-1"
>
    {@render children?.()}
</listing-thumbnail>

<style lang="scss">
listing-thumbnail {
    border-radius: 12px;
    width: 3rem;
    height: 3rem;

    display: grid;
    place-items: center;
    overflow: hidden;

    border: #afafaf 1px solid;

    &.is-create-placeholder {
        font-size: 2.5rem;
        font-weight: 200;
        line-height: 0;

        border-style: dashed;
    }
}
</style>