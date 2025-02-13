<script lang="ts">
import { apiFetch } from "$/routes/util";
import ListingDisplay from "$/stories/Listing/ListingDisplay.svelte";
import { goto } from "$app/navigation";
import {store} from "$routes/store.svelte";

if (!store.isSeller) {
    goto("/");
}

</script>


{#if store.isSeller && store.user !== null}
    <seller-dashboard>
        <h1>Seller dashboard</h1>
        
        <h2>Your stats</h2>
        
        <seller-listings>
            <h2>Your listings</h2>

            {#await apiFetch(`listing/by-seller?sellerUserId=${store.user.id}`)}
                <div>Loading listings...</div>
            {:then response}
                {@const listings = response.listings}

                {#if listings.length > 0}
                    <listings-list>
                        {#each listings as listing (listing.id)}
                            <ListingDisplay
                                title={listing.title}
                                onClick={() => goto(`/listing?edit&id=${listing.id}`)}
                            />
                        {/each}
                    </listings-list>
                {:else}
                    <div>No listings yet!</div>
                {/if}
            {:catch}
                <div>Failed to load listings</div>
            {/await}

            <button onclick={() => goto("/listing?new")}>Create a new listing</button>
        </seller-listings>


        <seller-livestreams>

        </seller-livestreams>
    </seller-dashboard>
{/if}


<style lang="scss">
seller-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

listings-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>