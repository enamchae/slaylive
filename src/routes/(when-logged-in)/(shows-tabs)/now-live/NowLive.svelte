<script lang="ts">
    import { api } from "$api/client";
    import { goto } from "$app/navigation";
    import Button from "@/Button.svelte";

const joinStream = (streamId: string) => {
    goto(`/watch?streamId=${encodeURIComponent(streamId)}`);
};
</script>

<now-live>
    {#await api.stream.list({})}
        <div>Loading ongoing livestreams</div>
    {:then livestreams}
        {#each livestreams as livestream (livestream.id)}
            <div>
                <Button
                    onClick={() => joinStream(livestream.id)}
                >
                    {livestream.title}
                </Button>
            </div>
        {/each}
    {:catch error}
        <div>Could not load livestreams: {error}</div>
    {/await}
</now-live>


<style lang="scss">
now-live {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
