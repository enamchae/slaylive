<script lang="ts">
    import Button from "@/Button.svelte";
    import { store } from "$routes/store.svelte";
    import Loading from "@/Loading.svelte";
    import ListingDisplayList from "@/listing/ListingDisplayList.svelte";
    import { editStreamListingSelection, getListingsBySeller } from "$api/api";
    import { SvelteSet } from "svelte/reactivity";
    import { streamState, refreshStreamData } from "../../store.svelte";

let waiting = $state(false);
const selectedListingIds = $state(
    new SvelteSet<string>(
        streamState().data.listings[Symbol.iterator]()
            .map(listing => listing.id)
    )
);

const streamId = $derived(streamState().id);

const save = async () => {
    if (streamId === null) return;

    waiting = true;

    await editStreamListingSelection({
        streamId,
        listingIds: [...selectedListingIds],
    });

    waiting = false;

    // Refresh the stream data to get the updated listings
    refreshStreamData();

    history.back();
};

const cancel = async () => {
    history.back();
};
</script>

{#if store.user !== null}
    {#await getListingsBySeller({sellerUserId: store.user.id})}
        <Loading />
    {:then response}
        {@const listings = response.listings}

        <Button
            onClick={save}
            disabled={waiting}
            strong
        >Save</Button>

        <Button
            onClick={cancel}
            disabled={waiting}
        >Cancel</Button>

        {#if listings.length > 0}
            <ListingDisplayList
                {listings}
                onClickListing={listing => {
                    if (!selectedListingIds.has(listing.id)) {
                        selectedListingIds.add(listing.id);
                    } else {
                        selectedListingIds.delete(listing.id);
                    }
                }}
                selectedIds={selectedListingIds}
            />
        {:else}
            <div>No listings yet!</div>
        {/if}
    {:catch}
        <div>Failed to load listings</div>
    {/await}
{/if}
