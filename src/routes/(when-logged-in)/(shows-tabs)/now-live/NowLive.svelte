<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "@/Button.svelte";
    import { getLivestreamList } from "$api/livestream/list/endpoint";

const joinCall = (callId: string) => {
    goto(`/watch?call_id=${encodeURIComponent(callId)}`);
};
</script>

<now-live>
    {#await getLivestreamList({})}
        <div>Loading ongoing livestreams</div>
    {:then livestreams}
        {#each livestreams as livestream (livestream.id)}
            <div>
                <Button
                    onClick={() => joinCall(livestream.id)}
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
