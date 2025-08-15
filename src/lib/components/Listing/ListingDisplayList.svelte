<script lang="ts">
import { goto } from "$app/navigation";
import ListingDisplay from "./ListingDisplay.svelte";

type Listing = {
    id: string,
    title: string,
    images?: {
        id: string,
        url: string,
    }[],
};

const {
    listings,
    onClickListing,
    selectedIds = new Set(),
}: {
    listings: Listing[],
    onClickListing: (listing: Listing) => void,
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