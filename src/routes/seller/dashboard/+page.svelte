<script lang="ts">
import { apiFetch } from "$/routes/util";
import ListingDisplayList from "$/stories/Listing/ListingDisplayList.svelte";
import { goto } from "$app/navigation";
import {store} from "$routes/store.svelte";

if (!store.isSeller) {
    goto("/");
}

</script>


{#if store.isSeller && store.user !== null}
    <seller-dashboard>
        <h1>seller dashboard</h1>

        <seller-profile>
            <h2>profile</h2>
        </seller-profile>
        
        <seller-stats>
            <h2>stats</h2>
        </seller-stats>
        
        <seller-listings>
            <h2>listings</h2>

            {#await apiFetch(`listing/by-seller?sellerUserId=${store.user.id}`)}
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

            <button onclick={() => goto("/listing?new")}>Create a new listing</button>
        </seller-listings>


        <seller-livestreams>
            <h2>livestreams</h2>
            <button onclick={() => goto("/livestream/backstage?new")}>Set up a new livestream</button>
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