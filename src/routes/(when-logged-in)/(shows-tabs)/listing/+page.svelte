<script lang="ts">
import { validate } from "$/lib/shared/validation";
import ListingPhotoAddButton from "@/listing/ListingPhotoAddButton.svelte";
import ListingPhoto from "@/listing/ListingPhoto.svelte";
import RichTextEntry from "@/RichTextEntry.svelte";
import SubtleExclamation from "@/SubtleExclamation.svelte";
import { onDestroy } from "svelte";
    import { store } from "$routes/store.svelte";
    import TitledPage from "../TitledPage.svelte";
    import { api } from "$api/client";
    import { compressImage } from "$/lib/utils/image-compression";


const searchParams = new URLSearchParams(location.search);

let editing = $state((searchParams.has("new") || searchParams.has("edit")) && (store.user?.canSell ?? false));
let listingId = $state(searchParams.get("id") ?? null);

let listingPromise = $derived(
    listingId === null
        ? Promise.resolve({title: "", description: "", images: [], onDisplay: false})
        : api.listing.details({ listingId })
);

let listing = $state<{
    title: string,
    description: string,
    onDisplay: boolean,
    images: {
        id: string | null,
        url: string,
        uploading?: boolean,
        error?: string,
        file?: File,
    }[],
} | null>(null);

(async () => {
    const response = await listingPromise;
    listing = {
        title: response.title,
        description: response.description,
        images: response.images,
        onDisplay: response.onDisplay,
    };
})();

let listingImageSelectedIndex = $state(0);

$effect(() => {
    if (listing === null) return;
    // Ensure index is valid and reset to 0 if no images
    if (listing.images.length === 0) {
        listingImageSelectedIndex = 0;
    } else {
        listingImageSelectedIndex = Math.min(listingImageSelectedIndex, listing.images.length - 1);
    }
});

onDestroy(() => {
    if (listing === null) return;

    for (const image of listing.images) {
        if (image.url.startsWith("blob:")) {
            URL.revokeObjectURL(image.url);
        }
    }
});

const saveListing = async () => {
    if (listing === null) return;

    const validationResult = validate.listing({title: listing.title, description: listing.description});
    if (!validationResult.ok) {
        return;
    }

    try {
        if (listingId !== null) {
            // Edit existing listing
            await api.listing.edit({
                listingId,
                listingTitle: listing.title,
                listingDescription: listing.description,
                listingOnDisplay: listing.onDisplay,
            });
        } else {
            // Create new listing
            const result = await api.listing.new({
                listingTitle: listing.title,
                listingDescription: listing.description,
                listingOnDisplay: listing.onDisplay,
            });
            
            // Upload any pending images
            const newListingId = result.listingId;
            const imagesToUpload = listing.images.filter(img => img.file && !img.id);
            
            for (let i = 0; i < listing.images.length; i++) {
                const image = listing.images[i];
                if (image.file && !image.id) {
                    listing.images[i].uploading = true;
                    
                    try {
                        // Compress image
                        const compressedFile = await compressImage(image.file, {
                            maxWidth: 1920,
                            maxHeight: 1920,
                            quality: 0.85,
                            maxSizeMB: 2
                        });
                        
                        // Upload image
                        const uploadResult = await api.listing.image.upload({
                            listingId: newListingId,
                            image: compressedFile,
                        });
                        
                        // Update with uploaded image data
                        if (image.url.startsWith('blob:')) {
                            URL.revokeObjectURL(image.url);
                        }
                        listing.images[i] = {
                            id: uploadResult.id,
                            url: uploadResult.url,
                            uploading: false,
                        };
                    } catch (error) {
                        listing.images[i].uploading = false;
                        listing.images[i].error = error instanceof Error ? error.message : 'Upload failed';
                        console.error('Failed to upload image:', error);
                    }
                }
            }
            
            // Update the listingId for future edits
            listingId = newListingId;
        }
        
        editing = false;
    } catch (error) {
        console.error('Failed to save listing:', error);
        alert('Failed to save listing. Please try again.');
    }
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
                        {#if listing.images.length > 0 && listing.images[listingImageSelectedIndex]}
                            <img
                                src={listing.images[listingImageSelectedIndex].url}
                                alt={`"${listing.title}" main image`}
                            />
                        {:else}
                            <div>
                                No images added yet!
                            </div>
                        {/if}
                    </main-photo>
                
                    <photos-carousel>
                        {#each listing.images as image, i (image.id || `temp-${i}`)}
                            <ListingPhoto
                                {image}
                                {editing}
                                onClick={() => {
                                    listingImageSelectedIndex = i;
                                }}
                                onDelete={async () => {
                                    if (listing === null) return;
                                    
                                    // If image has an ID, delete from server
                                    if (image.id && !image.uploading) {
                                        try {
                                            await api.listing.image.delete({ imageId: image.id });
                                        } catch (error) {
                                            console.error('Failed to delete image:', error);
                                            return;
                                        }
                                    }
                                    
                                    // Clean up blob URL if exists
                                    if (image.url.startsWith('blob:')) {
                                        URL.revokeObjectURL(image.url);
                                    }
                                    
                                    // Remove from array
                                    listing.images.splice(i, 1);
                                    
                                    // Adjust selected index if needed
                                    if (listingImageSelectedIndex >= listing.images.length && listing.images.length > 0) {
                                        listingImageSelectedIndex = listing.images.length - 1;
                                    }
                                }}
                            />
                        {/each}

                        {#if editing}
                            <ListingPhotoAddButton
                                onSelectFiles={async files => {
                                    if (listing === null) return;
                                    
                                    // For new listings, just add to array without uploading
                                    if (listingId === null) {
                                        for (const file of files) {
                                            const url = URL.createObjectURL(file);
                                            listing.images.push({
                                                id: null,
                                                url,
                                                file,
                                            });
                                        }
                                        return;
                                    }
                                    
                                    // For existing listings, compress and upload immediately
                                    for (const file of files) {
                                        const tempUrl = URL.createObjectURL(file);
                                        const imageIndex = listing.images.length;
                                        listing.images.push({
                                            id: null,
                                            url: tempUrl,
                                            uploading: true,
                                            file,
                                        });
                                        
                                        try {
                                            // Compress image
                                            const compressedFile = await compressImage(file, {
                                                maxWidth: 1920,
                                                maxHeight: 1920,
                                                quality: 0.85,
                                                maxSizeMB: 2
                                            });
                                            
                                            // Upload image
                                            const result = await api.listing.image.upload({
                                                listingId,
                                                image: compressedFile,
                                            });
                                            
                                            // Update with uploaded image data
                                            URL.revokeObjectURL(tempUrl);
                                            listing.images[imageIndex] = {
                                                id: result.id,
                                                url: result.url,
                                                uploading: false,
                                            };
                                        } catch (error) {
                                            // Handle upload error
                                            listing.images[imageIndex].uploading = false;
                                            listing.images[imageIndex].error = error instanceof Error ? error.message : 'Upload failed';
                                        }
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
    max-width: 20rem;

    background: #5009097f;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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