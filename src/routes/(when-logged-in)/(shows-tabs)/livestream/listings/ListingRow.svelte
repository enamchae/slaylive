<script lang="ts">
    import RichTextEntry from "@/RichTextEntry.svelte";
    import ListingDisplay from "@/listing/ListingDisplay.svelte";
    import { api } from "$api/client";
    import Button from "@/Button.svelte";
    import { streamState } from "../store.svelte";
    import { LivestreamEventType, type LivestreamEvent } from "@/stream/interaction/CallEvent";

const {
    listing,
}: {
    listing: Awaited<ReturnType<typeof api.stream.details>>["listings"][0],
} = $props();


let newPrice = $state(listing.price);

const streamId = $derived(streamState().id);
const callData = $derived(streamState().callData);

let waiting = $state(false);

const savePrice = async () => {
    if (streamId === null) return;

    if (!/[^\d]+.?[^\d]*/.test(newPrice)) {
        newPrice = listing.price;
        return;
    }

    waiting = true;

    await api.stream.edit.listing.price({
        streamId,
        listingId: listing.id,
        price: newPrice,
    });

    listing.price = newPrice;

    waiting = false;
};

const toggleActivation = async () => {
    if (streamId === null) return;

    waiting = true;

    await api.stream.edit.listing.activation({
        streamId,
        listingId: listing.id,
        active: !listing.active,
    });

    waiting = false;

    listing.active = !listing.active;


    if (callData === null) return;

    await callData.call.sendCustomEvent({
        type: LivestreamEventType.UpdateListing,
        data: {
            listing,
        },
    } satisfies LivestreamEvent<LivestreamEventType.UpdateListing>);
};
</script>


<listing-row>
    <ListingDisplay
        {listing}
        small
    />

    <listing-settings>
        <h4>{listing.title}</h4>

        <RichTextEntry
            label="price"
            initialText={listing.price}
            onInput={text => newPrice = text}
            onChange={savePrice}
            placeholder="0.00"
        />
    </listing-settings>

    <listing-actions>
        <Button
            onClick={toggleActivation}
            disabled={waiting}
        >
            {#if listing.active}
                Deactivate
            {:else}
                Activate
            {/if}
        </Button>
    </listing-actions>
</listing-row>

<style lang="scss">
listing-row {
    display: flex;
    gap: 1rem;
}

listing-settings {
    flex-grow: 1;
}

listing-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
}
</style>