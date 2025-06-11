<script lang="ts">
import ListingPhotoThumbnail from "./ListingPhotoThumbnail.svelte";

const {
    onSelectFiles,
}: {
    onSelectFiles: (files: FileList) => void,
} = $props();

let fileInput = $state<HTMLInputElement | null>(null);
</script>

<ListingPhotoThumbnail
    isCreatePlaceholder
    onClick={() => {
        fileInput?.click();
    }}
>+</ListingPhotoThumbnail>

<input
    type="file"
    bind:this={fileInput}
    onchange={() => {
        if (fileInput === null || fileInput.files === null) return;
        onSelectFiles(fileInput.files);
    }}
/>

<style lang="scss">
input {
    display: none;
}
</style>