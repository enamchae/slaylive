<script lang="ts">
    import Button from "@/Button.svelte";
    import { streamState } from "../store.svelte";
    import ListingRow from "./ListingRow.svelte";
    import { goto } from "$app/navigation";
    import { LivestreamEventType, type LivestreamEvent } from "@/stream/interaction/CallEvent";

const streamData = $derived(streamState().data);
</script>


<stream-listings>
    <Button
        onClick={() => goto("/livestream/listings/edit-selection")}
    >
        Edit listing selection
    </Button>


    {#each streamData.listings as listing (listing.id)}
        <ListingRow
            {listing}
        />
    {/each}
</stream-listings>

<style lang="scss">
stream-listings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>