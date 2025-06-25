<script>
    import Button from "@/Button.svelte";
    import { goto } from "$app/navigation";
    import { store } from "$routes/store.svelte";
    import TabbedPage from "../../TitledPage.svelte";
    import Loading from "@/Loading.svelte";
    import { editStream } from "../../livestream/store.svelte";
    import { api } from "$api/client";

</script>

{#if store.user}
    <TabbedPage
        heading="my streams"
        hasBackButton
    >
        <seller-livestreams>
            <Button
                onClick={() => goto("/livestream?new")}
                strong
            >New stream</Button>

            {#await api.stream.bySeller({sellerUserId: store.user.id})}
                <Loading />
            {:then response}
                {@const livestreams = response.livestreams}

                {#if livestreams.length > 0}
                    {#each livestreams as livestream}
                        <Button onClick={() => editStream(livestream.id)}>
                            {livestream.title}
                        </Button>
                    {/each}
                {:else}
                    <div>No livestreams yet!</div>editStream
                {/if}
            {:catch}
                <div>Failed to load livestreams</div>
            {/await}
        </seller-livestreams>
    </TabbedPage>
{/if}

<style lang="scss">
seller-livestreams {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>