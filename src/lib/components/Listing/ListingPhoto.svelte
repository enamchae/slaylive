<script lang="ts">
import ListingPhotoThumbnail from "./ListingPhotoThumbnail.svelte";

const {
    image,
    onClick,
    onDelete,
    editing = false,
}: {
    image: {
        id: string | null;
        url: string;
        uploading?: boolean;
        error?: string;
    };
    onClick: () => void;
    onDelete?: () => void;
    editing?: boolean;
} = $props();
</script>

<ListingPhotoThumbnail {onClick}>
    <img
        src={image.url}
        alt="Listing thumbnail"
        class:uploading={image.uploading}
    />
    
    {#if image.uploading}
        <div class="overlay uploading">
            <div class="spinner"></div>
            <span>Uploading...</span>
        </div>
    {/if}
    
    {#if image.error}
        <div class="overlay error">
            <span>⚠️ {image.error}</span>
        </div>
    {/if}
    
    {#if editing && !image.uploading && onDelete}
        <button
            class="delete-button"
            onclick={(e) => {
                e.stopPropagation();
                onDelete();
            }}
            title="Delete image"
        >
            ×
        </button>
    {/if}
</ListingPhotoThumbnail>

<style lang="scss">
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    
    &.uploading {
        opacity: 0.5;
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.875rem;
    pointer-events: none;
    
    &.error {
        background: rgba(255, 0, 0, 0.8);
    }
}

.spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 0.5rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.delete-button {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    
    &:hover {
        background: rgba(255, 0, 0, 1);
    }
}
</style>
