<script lang="ts">
import type { ListingWithImages } from "$/lib/server/listing";
import ListingDisplay from "./ListingDisplay.svelte";

const {
    listings,
    onClickListing,
    selectedIds = new Set(),
}: {
    listings: ListingWithImages[],
    onClickListing: (listing: ListingWithImages) => void,
    selectedIds?: Set<string>,
} = $props();

</script>

<listings-list>
    {#each listings as listing (listing.id)}
        <ListingDisplay
            {listing}
            onClick={() => onClickListing(listing)}
            selected={selectedIds.has(listing.id)}
        />
    {/each}
</listings-list>


<style lang="scss">
listings-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>