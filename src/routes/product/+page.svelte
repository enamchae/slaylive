<script lang="ts">
    import ListingPhotoAddButton from "$/stories/Listing/ListingPhotoAddButton.svelte";
    import ListingPhotoButton from "$/stories/Listing/ListingPhotoButton.svelte";
    import RichTextEntry from "$/stories/RichTextEntry.svelte";
    import SubtleExclamation from "$/stories/SubtleExclamation.svelte";
    import { goto } from "$app/navigation";
import {apiFetchAuthorized} from "$routes/util";
    import { onDestroy } from "svelte";

const {
    productExists,
}: {
    productExists: boolean,
} = $props();

let editing = $state(new URLSearchParams(location.search).has("new"));

let listingTitle = $state("");
let listingDescription = $state("");
let listingImageUrls = $state<string[]>([]);
let listingImageSelectedIndex = $state(0);

$effect(() => {
    listingImageSelectedIndex = Math.min(listingImageSelectedIndex, listingImageUrls.length - 1);
});

onDestroy(() => {
    for (const url of listingImageUrls) {
        URL.revokeObjectURL(url);
    }
});

const saveListing = async () => {
    if (productExists) {
        await apiFetchAuthorized("listing/edit", {
            method: "PUT",
            body: JSON.stringify({
                productTitle: listingTitle,
                productDescription: listingDescription,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        await apiFetchAuthorized("listing/new", {
            method: "PUT",
            body: JSON.stringify({
                productTitle: listingTitle,
                productDescription: listingDescription,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    goto("/seller/dashboard");
};
</script>

<listing-display
    class:editing={editing}
>
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
            {#if listingImageUrls.length >= 1}
                <img
                    src={listingImageUrls[listingImageSelectedIndex]}
                    alt={`"${listingTitle}" main image`}
                />
            {:else}
                <div>
                    No images added yet!
                </div>
            {/if}
        </main-photo>
    
        <photos-carousel>
            {#each listingImageUrls as listingImageUrl, i}
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
                        for (const file of files) {
                            const url = URL.createObjectURL(file);
                            listingImageUrls.push(url);
                        }
                    }}
                />
            {/if}
        </photos-carousel>
    </listing-photos>
    
    <listing-title
        placeholder="title"
        class="title"
    >
        <RichTextEntry
            initialText=""
            onInput={text => listingTitle = text}
            placeholder="an eyecatching title"
        />
    </listing-title>
    
    <listing-description>
        <RichTextEntry
            initialText=""
            onInput={text => listingDescription = text}
            placeholder="a detailed description"
        />
    </listing-description>
    
</listing-display>

<style lang="scss">
listing-display {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > :not(listing-photos) {
        margin: 0 1rem;
    }

    &.editing :is(listing-title, listing-description) {
        border: 1px dashed #afafaf;
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

    background: #b8ceb8;
    color: #203a20;

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

.title {
    font-size: 1.75rem;
    font-weight: 100;
}
</style>