<script>
    import Button from "@/Button.svelte";
    import { goto } from "$app/navigation";
    import { store } from "$routes/store.svelte";
    import TabbedPage from "../../TitledPage.svelte";
    import Loading from "@/Loading.svelte";
    import { getListingsBySeller } from "$api/listing/by-seller/endpoint";
    import ListingDisplayList from "@/listing/ListingDisplayList.svelte";

</script>

{#if store.user}
    <TabbedPage
        heading="my listings"
        hasBackButton
    >
        <seller-listings>
            <Button
                onClick={() => goto("/listing?new")}
                strong
            >Create new</Button>

            <listings-list>
                {#await getListingsBySeller({sellerUserId: store.user.id})}
                    <Loading />
                {:then response}
                    {@const listings = response.listings}

                    {#if listings.length > 0}
                        <ListingDisplayList
                            {listings}
                            onClickListing={listing => goto(`/listing?edit&id=${listing.id}`)}
                        />
                    {:else}
                        <div>No listings yet!</div>
                    {/if}
                {:catch}
                    <div>Failed to load listings</div>
                {/await}
            </listings-list>

        </seller-listings>
    </TabbedPage>
{/if}

<style lang="scss">
seller-listings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>