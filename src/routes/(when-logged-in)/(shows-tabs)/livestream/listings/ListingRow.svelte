<script lang="ts">
    import RichTextEntry from "@/RichTextEntry.svelte";
    import ListingDisplay from "@/listing/ListingDisplay.svelte";
    import type { getStreamInfo } from "$api/api";

const {
    listing,
    onSetPrice,
}: {
    listing: Awaited<ReturnType<typeof getStreamInfo>>["listings"][0],
    onSetPrice: (price: number) => void,
} = $props();

</script>


<listing-row>
    <ListingDisplay
        title={listing.title}
        small
    />

    <listing-settings>
        <h3>{listing.title}</h3>

        <RichTextEntry
            label="price"
            initialText="0.00"
            onInput={text => {
                const price = parseFloat(text);
                if (isNaN(price)) return;
                
                onSetPrice(price);
            }}
            placeholder="0.00"
        />
    </listing-settings>
</listing-row>

<style lang="scss">
listing-row {
    display: flex;
    gap: 1rem;
}
</style>