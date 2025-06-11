<script lang="ts">
import ListingPhotoThumbnail from "./ListingPhotoThumbnail.svelte";

const {
    imageUrl,
    onClick,
}: {
    imageUrl: string,
    onClick: () => void,
} = $props();
</script>

<ListingPhotoThumbnail {onClick}>
    <img
        src={imageUrl}
        alt="Listing thumbnail"
    />
</ListingPhotoThumbnail>

<style lang="scss">
img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>