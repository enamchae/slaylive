
<livestream-listings>
    {#each livestreamData.listings as listing (listing.id)}
        <ListingRow
            {listing}
            editing={canEdit}
            onSetPrice={console.log}
        />
    {/each}

    <Button
        onClick={() => {}}
    >
        Edit listing selection
    </Button>


    <!-- {#await listingsPromise}
        <div>Loading listings...</div>
    {:then response}
        {@const listings = response.listings}

        {#if listings.length > 0}
            {#each listings as listing (listing.id)}
                <ListingRow
                    {listing}
                    selected={selectedListingIds.has(listing.id)}
                    editing={canEdit}
                    onToggle={() => toggleListing(listing.id)}
                    onSetPrice={console.log}
                />
            {/each}
        {:else}
            <div>No listings yet!</div>
        {/if}
    {:catch}
        <div>Failed to load listings</div>
    {/await} -->
</livestream-listings>