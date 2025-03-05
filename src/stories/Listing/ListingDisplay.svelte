<script lang="ts">
const {
    title,
    onClick,
    selected,
}: {
    title: string,
    onClick: () => void,
    selected: boolean,
} = $props();
</script>

<listing-display
    onclick={onClick}
    tabindex="-1"
    class:selected={selected}
>
    {title}
</listing-display>

<style lang="scss">
listing-display {
    display: grid;
    place-items: center;
    width: 10rem;
    aspect-ratio: 1/1;

    background: #b8ceb8;

    &.selected {
        border: 2px solid #615f04;
    }
}
</style>