<script>
import ListingDisplayList from "@/listing/ListingDisplayList.svelte";
import { goto } from "$app/navigation";
import { getListingList } from "$api/listing/list/endpoint";
    import TitledPage from "../TitledPage.svelte";
</script>

<TitledPage
    heading="browse"
>
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
</TitledPage>

<style lang="scss">
browse-listings {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>