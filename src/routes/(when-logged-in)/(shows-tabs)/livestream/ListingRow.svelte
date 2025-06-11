<script lang="ts">
    import Button from "@/Button.svelte";
import ListingDisplay from "@/Listing/ListingDisplay.svelte";

const {
    listing,
    selected,
    editing,
    onToggle,
}: {
    listing: any,
    selected: boolean,
    editing: boolean,
    onToggle: () => void,
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
            $<input
                type="number"
                class="heading heading-3"
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

    --row-unselected-height: 4rem;
    height: auto;
    &:not(.selected) {
        height: var(--row-unselected-height);
    }
}
</style>