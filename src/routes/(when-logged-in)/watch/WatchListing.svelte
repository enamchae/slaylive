<script lang="ts">
    import type { getStreamInfo } from "$api/api";
    import Button from "@/Button.svelte";
    import ListingDisplay from "@/listing/ListingDisplay.svelte";

const {
    listing,
}: {
    listing: Awaited<ReturnType<typeof getStreamInfo>>["listings"][0],
} = $props();
</script>

<watch-listing>
    <listing-display>
        <ListingDisplay
            title={listing.title}
        />
    </listing-display>

    <listing-top>
        <h2>{listing.title}</h2>

        <Button
            onClick={() => {}}
            strong
        >${listing.price}</Button>
    </listing-top>

    <listing-description>
        {listing.description}
    </listing-description>
</watch-listing>

<style lang="scss">
watch-listing {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
}

listing-display {
    grid-area: 1/1;
    place-self: center;
}

listing-top {
    display: flex;
    flex-direction: column;

    grid-area: 1/2;
}

listing-description {
    grid-area: 2/1 / 3/3;
}
</style>