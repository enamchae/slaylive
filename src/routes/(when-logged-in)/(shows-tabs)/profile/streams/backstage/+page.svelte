<script>
    import { store } from "$routes/store.svelte";
    import TitledPage from "$routes/(when-logged-in)/(shows-tabs)/TitledPage.svelte";
    import FlatList from "@/FlatList.svelte";

</script>

<editor-tabs>
</editor-tabs>

{#if store.user}
    <TitledPage
        heading="stream options"
        hasBackButton
    >
        <FlatList
            items={[
                {
                    label: "Details",
                    onClick: () => {},
                },
                {
                    label: "Backstage",
                    onClick: () => {},
                },
            ]}
        />
    </TitledPage>
{/if}