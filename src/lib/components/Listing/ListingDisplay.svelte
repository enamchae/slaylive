<script lang="ts">
    import type { ListingWithImages } from "$/lib/server/listing";

const {
    listing,
    onClick = () => {},
    small = false,
    selected = false,
}: {
    listing: ListingWithImages,
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
    {#if listing.images.length > 0}
        <img
            src={listing.images[0].url}
            alt={listing.title}
        />
    {:else}
        {listing.title}
    {/if}
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

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>