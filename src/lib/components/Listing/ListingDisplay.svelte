<script lang="ts">
const {
    title,
    onClick = () => {},
    small = false,
    selected = false,
}: {
    title: string,
    onClick?: () => void,
    small?: boolean,
    selected?: boolean,
} = $props();

</script>

<button
    onclick={onClick}
    tabindex="-1"
    class:small
    class:selected
>
    {title}
</button>

<style lang="scss">
button {
    display: grid;
    place-items: center;
    width: 10rem;
    aspect-ratio: 1/1;

    background: #5009097f;

    &.small {
        width: 5rem;
    }

    &.selected {
        outline: 2px solid #fff;
    }
}
</style>