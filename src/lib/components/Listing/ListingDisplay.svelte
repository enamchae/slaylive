<script lang="ts">
const {
    title,
    onClick = () => {},
    small = false,
}: {
    title: string,
    onClick?: () => void,
    small?: boolean,
} = $props();
</script>

<listing-display
    onclick={onClick}
    tabindex="-1"
    class:small
>
    {title}
</listing-display>

<style lang="scss">
listing-display {
    display: grid;
    place-items: center;
    width: 10rem;
    aspect-ratio: 1/1;

    background: #5009097f;

    &.small {
        width: 5rem;
    }
}
</style>