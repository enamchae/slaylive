<script lang="ts">
import type { Snippet } from "svelte";
import { streamState } from "./store.svelte";
import { goto } from "$app/navigation";
    import { store } from "$routes/store.svelte";
    import Tabber from "@/Tabber.svelte";
    import PageScroller from "@/PageScroller.svelte";


const {
    children,
}: {
    children: Snippet,
} = $props();



const tabberTabs = {
    details: "Details",
    listings: "Listings",
    record: "Record",
};

let currentTab = $state(tabberTabs.details);

$effect(() => {
    switch (currentTab) {
        case tabberTabs.details:
            goto("/livestream/details");
            break;

        case tabberTabs.listings:
            goto("/livestream/listings");
            break;

        case tabberTabs.record:
            goto("/livestream/record");
            break;
    }
})
</script>


{#if store.isSeller && store.user !== null}
    <stream-dashboard>
        <Tabber
            currentLabel={currentTab}
            labels={Object.values(tabberTabs)}
            onClick={label => {
                currentTab = label;
            }}
        />

        <PageScroller>
            {@render children()}
        </PageScroller>
    </stream-dashboard>
{/if}


<style lang="scss">
stream-dashboard {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    overflow-y: auto;

    padding-top: 1rem;
}
</style>