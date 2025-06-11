<script lang="ts">
import Backstage from "./Backstage.svelte";

import {store} from "$routes/store.svelte";
import { goto } from "$app/navigation";
import RichTextEntry from "@/RichTextEntry.svelte";
import { apiFetchAuthenticated } from "$/routes/util";
import SubtleExclamation from "@/SubtleExclamation.svelte";
import { SvelteSet } from "svelte/reactivity";
    import Button from "@/Button.svelte";
    import ListingRow from "./ListingRow.svelte";
    import { getListingsBySeller } from "$api/listing/by-seller/endpoint";
    import { getLivestreamDetails } from "$/routes/api/livestream/details/endpoint";

if (!store.isSeller) {
    goto("/");
}

const searchParams = new URLSearchParams(location.search);

let editing = $state((searchParams.has("new") || searchParams.has("edit")) && (store.user?.canSell ?? false));
let livestreamId = $state(searchParams.get("id"));

const livestreamPromise = livestreamId === null
    ? Promise.resolve({title: "", description: "", active: false})
    : getLivestreamDetails({ livestreamId });

let livestream = $state<{
    title: string,
    description: string,
    active: boolean,
} | null>(null);


const listingsPromise = store.user === null
        ? Promise.resolve({listings: []})
        : getListingsBySeller({sellerUserId: store.user.id});
let selectedListingIds = $state(new SvelteSet<string>());

(async () => {
    const response = await livestreamPromise;
    livestream = {
        title: response.title,
        description: response.description,
        active: response.active,
    };
})();

const saveLivestream = async () => {
    if (livestream === null) return;

    // const validationResult = validate.listing({title: listing.title, description: listing.description});
    // if (!validationResult.ok) {
    //     return;
    // }

    if (livestreamId !== null) {
        await apiFetchAuthenticated("livestream/edit", {
            method: "PATCH",
            body: JSON.stringify({
                livestreamId,
                livestreamTitle: livestream.title,
                livestreamDescription: livestream.description,
                livestreamListingIds: [...selectedListingIds],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        ({livestreamId} = await apiFetchAuthenticated<{livestreamId: string}>("livestream/new", {
            method: "PUT",
            body: JSON.stringify({
                livestreamTitle: livestream.title,
                livestreamDescription: livestream.description,
                livestreamListingIds: [...selectedListingIds],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }));
    }

    editing = false;
};

const toggleListing = (listingId: string) => {
    if (selectedListingIds.has(listingId)) {
        selectedListingIds.delete(listingId);
    } else {
        selectedListingIds.add(listingId);
    }
};

const startLivestream = async () => {
    if (livestream === null) return;

    await apiFetchAuthenticated("livestream/start", {
        method: "POST",
        body: JSON.stringify({
            livestreamId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    livestream.active = true;
};

const stopLivestream = async () => {
    if (livestream === null) return;

    await apiFetchAuthenticated("livestream/stop", {
        method: "POST",
        body: JSON.stringify({
            livestreamId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    livestream.active = false;
};
</script>


{#if store.isSeller && store.user !== null}
    {#await livestreamPromise}
        <div>Loading livestream...</div>
    {:then}
        {#if livestream !== null}
            <livestream-dashboard>
                <div>
                    <SubtleExclamation>You're editing this livestream!</SubtleExclamation>
                    <Button
                        onClick={saveLivestream}
                        strong
                    >Save</Button>
                </div>

                
                <livestream-title>
                    {#if editing}
                        <RichTextEntry
                            initialText={livestream.title}
                            onInput={text => livestream !== null && (livestream.title = text)}
                            placeholder="stream title"
                            classes="heading heading-1"
                        />
                    {:else}
                        <h1>{livestream.title}</h1>
                    {/if}
                </livestream-title>

                <livestream-description>
                    {#if editing}
                        <RichTextEntry
                            initialText={livestream.description}
                            onInput={text => livestream !== null && (livestream.description = text)}
                            placeholder="stream description"
                        />
                    {:else}
                        <div>{livestream.description}</div>
                    {/if}
                </livestream-description>

                <livestream-listings>
                    <h2>attached listings</h2>

                    {#await listingsPromise}
                        <div>Loading listings...</div>
                    {:then response}
                        {@const listings = response.listings}
        
                        {#if listings.length > 0}
                            {#each listings as listing (listing.id)}
                                <ListingRow
                                    {listing}
                                    selected={selectedListingIds.has(listing.id)}
                                    {editing}
                                    onToggle={() => toggleListing(listing.id)}
                                    onSetPrice={console.log}
                                />
                            {/each}
                        {:else}
                            <div>No listings yet!</div>
                        {/if}
                    {:catch}
                        <div>Failed to load listings</div>
                    {/await}
                </livestream-listings>

                <livestream-start-stop>
                    <Button
                        onClick={() => startLivestream()}
                        disabled={livestreamId === null || livestream.active}
                    >Open room</Button>

                    <Button
                        onClick={() => stopLivestream()}
                        disabled={!livestream.active}
                    >Close room</Button>
                </livestream-start-stop>

                {#await listingsPromise}
                    <div>Loading listings...</div>
                {:then response}
                    {@const listings = response.listings}

                    {#if livestream.active && livestreamId !== null}
                        <Backstage
                            userToken={store.user.streamioAuth.token}
                            userId={store.user.streamioAuth.id}
                            userName={store.user.streamioAuth.name}
                            {livestreamId}
                            listings={listings.filter(listing => selectedListingIds.has(listing.id))}
                        />
                    {/if}
                {:catch}
                    <div>Failed to load listings</div>
                {/await}
            </livestream-dashboard>
        {/if}
    {:catch}
        <div>Failed to load livestream!</div>
    {/await}
{/if}

<style lang="scss">
livestream-dashboard {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > * {
        margin: 0 1rem;
    }
}

livestream-title {
    font-size: 1.75rem;
    font-weight: 100;
}
</style>