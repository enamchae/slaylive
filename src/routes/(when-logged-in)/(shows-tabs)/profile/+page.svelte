<script lang="ts">
import { goto } from "$app/navigation";
import {store} from "$routes/store.svelte";
import FlatList from "@/FlatList.svelte";
    import TabbedPage from "../TitledPage.svelte";

if (!store.isSeller) {
    goto("/");
}

</script>


{#if store.isSeller && store.user !== null}
    <TabbedPage
        heading="profile"
    >
        <FlatList
            items={[
                {
                    label: "Stats",
                    onClick: () => {},
                },
                {
                    label: "Listings",
                    onClick: () => goto("/profile/listings"),
                },
                {
                    label: "Streams",
                    onClick: () => goto("/profile/streams"),
                },
            ]}
        />
    </TabbedPage>
{/if}


<style lang="scss">
seller-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>