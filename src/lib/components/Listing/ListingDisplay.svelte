<script lang="ts">
const {
    title,
    onClick = () => {},
}: {
    title: string,
    onClick?: () => void,
} = $props();
</script>

<listing-display
    onclick={onClick}
    tabindex="-1"
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
}
</style>