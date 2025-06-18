<script lang="ts">
    import type { getStreamInfo } from "$api/api";

const {
    listing,
}: {
    listing: Awaited<ReturnType<typeof getStreamInfo>>["listings"][0],
} = $props();
</script>

<watch-listing>
    <h3>{listing.title}</h3>

    ${listing.price}
</watch-listing>

<style lang="scss">
watch-listing {
    display: flex;
    flex-direction: column;
}
</style>