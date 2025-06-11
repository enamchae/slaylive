<script lang="ts">
import { apiFetch } from "$/routes/util";
    import Button from "@/Button.svelte";
import ListingDisplayList from "@/Listing/ListingDisplayList.svelte";
import { goto } from "$app/navigation";
import {store} from "$routes/store.svelte";
import { getListingsBySeller } from "$api/listing/by-seller/endpoint";
    import { getLivestreamsBySeller } from "$/routes/api/livestream/by-seller/endpoint";

if (!store.isSeller) {
    goto("/");
}

</script>


{#if store.isSeller && store.user !== null}
    <h1>profile</h1>
    <seller-dashboard>

        <seller-profile>
            <h2>profile</h2>
        </seller-profile>
        
        <seller-stats>
            <h2>stats</h2>
        </seller-stats>
        
        <seller-listings>
            <h2>listings</h2>

            {#await getListingsBySeller({sellerUserId: store.user.id})}
                <div>Loading listings...</div>
            {:then response}
                {@const listings = response.listings}

                {#if listings.length > 0}
                    <ListingDisplayList
                        {listings}
                        onClickListing={listing => goto(`/listing?edit&id=${listing.id}`)}
                    />
                {:else}
                    <div>No listings yet!</div>
                {/if}
            {:catch}
                <div>Failed to load listings</div>
            {/await}

            <Button onClick={() => goto("/listing?new")}>Create a new listing</Button>
        </seller-listings>


        <seller-livestreams>
            <h2>livestreams</h2>

            {#await getLivestreamsBySeller({sellerUserId: store.user.id})}
                <div>Loading listings...</div>
            {:then response}
                {@const livestreams = response.livestreams}

                {#if livestreams.length > 0}
                    {#each livestreams as livestream}
                        <Button onClick={() => goto(`/livestream?edit&id=${livestream.id}`)}>
                            {livestream.title}
                        </Button>
                    {/each}
                {:else}
                    <div>No livestreams yet!</div>
                {/if}
            {:catch}
                <div>Failed to load livestreams</div>
            {/await}

            <Button onClick={() => goto("/livestream?new")}>Set up a new livestream</Button>
        </seller-livestreams>
    </seller-dashboard>
{/if}


<style lang="scss">
seller-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>