<script lang="ts">
    import Button from "@/Button.svelte";
    import { streamState } from "../store.svelte";
    import ListingRow from "./ListingRow.svelte";
    import { goto } from "$app/navigation";

const streamData = $derived(streamState().data);
</script>


<livestream-listings>
    <Button
        onClick={() => goto("/livestream/listings/edit-selection")}
    >
        Edit listing selection
    </Button>


    {#each streamData.listings as listing (listing.id)}
        <ListingRow
            {listing}
            onSetPrice={console.log}
        />
    {/each}
</livestream-listings>