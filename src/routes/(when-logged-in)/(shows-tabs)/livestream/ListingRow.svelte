<script lang="ts">
    import RichTextEntry from "@/RichTextEntry.svelte";
    import Button from "@/Button.svelte";
import ListingDisplay from "@/Listing/ListingDisplay.svelte";

const {
    listing,
    selected,
    editing,
    onToggle,
    onSetPrice,
}: {
    listing: any,
    selected: boolean,
    editing: boolean,
    onToggle: () => void,
    onSetPrice: (price: number) => void,
} = $props();

</script>


<listing-row
    class:selected
>
    <input
        type="checkbox"
        oninput={() => editing && onToggle()}
        checked={selected}
    />

    <ListingDisplay
        title={listing.title}
        onClick={() => editing && onToggle()}
    />

    <listing-settings>
        <h3>{listing.title}</h3>

        {#if selected}
            $<RichTextEntry
                initialText="0.00"
                onInput={text => {
                    const price = parseFloat(text);
                    if (isNaN(price)) return;
                    
                    onSetPrice(price);
                }}
                placeholder="stream description"
            />
        {/if}
    </listing-settings>

    {#if selected}
        <Button>Start selling</Button>
    {/if}
</listing-row>

<style lang="scss">
listing-row {
    display: flex;
    gap: 1rem;
}
</style>