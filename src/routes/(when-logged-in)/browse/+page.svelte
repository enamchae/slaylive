<script>
import ListingDisplayList from "$/stories/Listing/ListingDisplayList.svelte";
import { goto } from "$app/navigation";
import { apiFetch } from "$routes/util";
</script>

<browse-listings>
    <h1>browse listings</h1>
    
    {#await apiFetch(`listing/list`)}
        <div>Loading listings...</div>
    {:then response}
        {@const listings = response.listings}
    
        {#if listings.length > 0}
            <ListingDisplayList
                {listings}
                onClickListing={listing => goto(`/listing?id=${listing.id}`)}
            />
        {:else}
            <div>No listings yet!</div>
        {/if}
    {:catch}
        <div>Failed to load listings</div>
    {/await}
</browse-listings>

<style lang="scss">
browse-listings {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>