<script lang="ts">
import { validate } from "$/lib/validation";
import ListingPhotoAddButton from "@/listing/ListingPhotoAddButton.svelte";
import ListingPhotoButton from "@/listing/ListingPhotoButton.svelte";
import RichTextEntry from "@/RichTextEntry.svelte";
import SubtleExclamation from "@/SubtleExclamation.svelte";
import { onDestroy } from "svelte";
    import { store } from "$routes/store.svelte";
    import TitledPage from "../TitledPage.svelte";
    import { getListingDetails, editListing, newListing } from "$api/api";


const searchParams = new URLSearchParams(location.search);

let editing = $state((searchParams.has("new") || searchParams.has("edit")) && (store.user?.canSell ?? false));
const listingId = searchParams.get("id") ?? null;

const listingPromise = listingId === null
    ? Promise.resolve({title: "", description: "", imageUrls: [], onDisplay: false})
    : getListingDetails({ listingId });

let listing = $state<{
    title: string,
    description: string,
    imageUrls: string[],
    onDisplay: boolean,
} | null>(null);

(async () => {
    const response = await listingPromise;
    listing = {
        title: response.title,
        description: response.description,
        imageUrls: response.imageUrls,
        onDisplay: response.onDisplay,
    };
})();

let listingImageSelectedIndex = $state(0);

$effect(() => {
    if (listing === null) return;
    listingImageSelectedIndex = Math.min(listingImageSelectedIndex, listing.imageUrls.length - 1);
});

onDestroy(() => {
    if (listing === null) return;

    for (const url of listing.imageUrls) {
        URL.revokeObjectURL(url);
    }
});

const saveListing = async () => {
    if (listing === null) return;

    const validationResult = validate.listing({title: listing.title, description: listing.description});
    if (!validationResult.ok) {
        return;
    }

    if (listingId !== null) {
        await editListing({
            listingId,
            listingTitle: listing.title,
            listingDescription: listing.description,
            listingOnDisplay: listing.onDisplay,
        });
    } else {
        await newListing({
            listingTitle: listing.title,
            listingDescription: listing.description,
            listingOnDisplay: listing.onDisplay,
        });
    }

    editing = false;
};
</script>

<TitledPage
    heading="listing"
    hasBackButton
>
    <listing-display
        class:editing={editing}
    >
        {#await listingPromise}
            <div>Loading listing details...</div>
        {:then}
            {#if listing !== null}
                {#if editing}
                    <div>
                        <SubtleExclamation>You're editing this listing!</SubtleExclamation>
                        <div>
                            <button onclick={saveListing}>Save</button>
                        </div>
                    </div>
                {/if}

                <listing-photos>
                    <main-photo>
                        {#if listing.imageUrls.length >= 1}
                            <img
                                src={listing.imageUrls[listingImageSelectedIndex]}
                                alt={`"${listing.title}" main image`}
                            />
                        {:else}
                            <div>
                                No images added yet!
                            </div>
                        {/if}
                    </main-photo>
                
                    <photos-carousel>
                        {#each listing.imageUrls as listingImageUrl, i (listingImageUrl)}
                            <ListingPhotoButton
                                imageUrl={listingImageUrl}
                                onClick={() => {
                                    listingImageSelectedIndex = i;
                                }}
                            />
                        {/each}

                        {#if editing}
                            <ListingPhotoAddButton
                                onSelectFiles={files => {
                                    if (listing === null) return;
                                    for (const file of files) {
                                        const url = URL.createObjectURL(file);
                                        listing.imageUrls.push(url);
                                    }
                                }}
                            />
                        {/if}
                    </photos-carousel>
                </listing-photos>
                
                <listing-title>
                    {#if editing}
                        <RichTextEntry
                            initialText={listing.title}
                            onInput={text => listing !== null && (listing.title = text)}
                            placeholder="an eyecatching title"
                        />
                    {:else}
                        <div>{listing.title}</div>
                    {/if}
                </listing-title>
                
                <listing-description>
                    {#if editing}
                        <RichTextEntry
                            initialText={listing.description}
                            onInput={text => listing !== null && (listing.description = text)}
                            placeholder="a detailed description"
                        />
                    {:else}
                        <div>{listing.description}</div>
                    {/if}
                </listing-description>

                {#if editing}
                    <listing-display-toggle>
                        <input
                            id="listing-display-toggle"
                            type="checkbox"
                            bind:checked={listing.onDisplay}
                        />

                        <label for="listing-display-toggle">On display</label>
                    </listing-display-toggle>
                {/if}
            {/if}
        {:catch}
            <div>Listing failed to load!</div>
        {/await}
    </listing-display>
</TitledPage>

<style lang="scss">
listing-display {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > :not(listing-photos) {
        margin: 0 1rem;
    }
}

listing-photos {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

main-photo {
    aspect-ratio: 1/1;
    display: grid;
    place-items: center;
    max-width: 20rem;

    background: #5009097f;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

photos-carousel {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

listing-title {
    font-size: 1.75rem;
    font-weight: 100;
}
</style>