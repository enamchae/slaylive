<script>
import ListingDisplayList from "@/Listing/ListingDisplayList.svelte";
import { goto } from "$app/navigation";
import { getListingList } from "$/routes/api/listing/list/endpoint";
</script>

<h1>browse</h1>
<browse-listings>
    
    {#await getListingList({})}
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