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
    import EditingBanner from "$/lib/components/EditingBanner.svelte";

if (!store.isSeller) {
    goto("/");
}

const searchParams = new URLSearchParams(location.search);

let canEdit = $state((searchParams.has("new") || searchParams.has("edit")) && (store.user?.canSell ?? false));
let livestreamId = $state(searchParams.get("id"));

let changesMade = $state(false);

const livestreamPromise = livestreamId === null
    ? Promise.resolve({title: "", description: "", active: false, listings: []})
    : getLivestreamDetails({ livestreamId });

let livestreamData = $state<{
    title: string,
    description: string,
    active: boolean,
    listings: {
        id: string,
    }[],
} | null>(null);

let lastSavedLivestreamData = $state<{
    title: string,
    description: string,
    active: boolean,
    listings: {
        id: string,
    }[],
} | null>(null);


(async () => {
    const response = await livestreamPromise;
    livestreamData = {
        title: response.title,
        description: response.description,
        active: response.active,
        listings: response.listings,
    };
    lastSavedLivestreamData = {...livestreamData};
})();

const saveLivestreamData = async () => {
    if (livestreamData === null) return;

    // const validationResult = validate.listing({title: listing.title, description: listing.description});
    // if (!validationResult.ok) {
    //     return;
    // }

    if (livestreamId !== null) {
        await apiFetchAuthenticated("livestream/edit", {
            method: "PATCH",
            body: JSON.stringify({
                livestreamId,
                livestreamTitle: livestreamData.title,
                livestreamDescription: livestreamData.description,
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
                livestreamTitle: livestreamData.title,
                livestreamDescription: livestreamData.description,
                livestreamListingIds: [...selectedListingIds],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }));
    }

    lastSavedLivestreamData = livestreamData;
    changesMade = false;
};

const startLivestream = async () => {
    if (livestreamData === null) return;

    await apiFetchAuthenticated("livestream/start", {
        method: "POST",
        body: JSON.stringify({
            livestreamId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    livestreamData.active = true;
};

const stopLivestream = async () => {
    if (livestreamData === null) return;

    await apiFetchAuthenticated("livestream/stop", {
        method: "POST",
        body: JSON.stringify({
            livestreamId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    livestreamData.active = false;
};


const setLivestreamText = (text: string) => {
    if (!canEdit || livestreamData === null) return;

    livestreamData.title = text;
    changesMade = true;
};

const setLivestreamDescription = (text: string) => {
    if (!canEdit || livestreamData === null) return;

    livestreamData.description = text;
    changesMade = true;
};


const discardChanges = () => {
    if (!canEdit || livestreamData === null || lastSavedLivestreamData === null) return;

    livestreamData = {...lastSavedLivestreamData};
    changesMade = false;
};
</script>


{#if store.isSeller && store.user !== null}
    {#await livestreamPromise}
        <div>Loading stream...</div>
    {:then}
        {#if livestreamData !== null}
            <livestream-dashboard>
                <EditingBanner
                    {changesMade}
                    onDiscard={discardChanges}
                    onSave={saveLivestreamData}
                >You're editing this stream!</EditingBanner>

                
                <livestream-title>
                    {#if canEdit}
                        <RichTextEntry
                            label="stream title"
                            initialText={livestreamData.title}
                            onInput={setLivestreamText}
                            placeholder="stream title"
                            classes="heading heading-1"
                        />
                    {:else}
                        <h1>{livestreamData.title}</h1>
                    {/if}
                </livestream-title>

                <livestream-description>
                    {#if canEdit}
                        <RichTextEntry
                            label="stream description"
                            initialText={livestreamData.description}
                            onInput={setLivestreamDescription}
                            placeholder="stream description"
                        />
                    {:else}
                        <div>{livestreamData.description}</div>
                    {/if}
                </livestream-description>

                <livestream-listings>
                    <h2>attached listings</h2>


                    {#each livestreamData.listings as listing (listing.id)}
                        <ListingRow
                            {listing}
                            editing={canEdit}
                            onSetPrice={console.log}
                        />
                    {/each}

                    <Button
                        onClick={() => {}}
                    >
                        Edit listing selection
                    </Button>


                    <!-- {#await listingsPromise}
                        <div>Loading listings...</div>
                    {:then response}
                        {@const listings = response.listings}
        
                        {#if listings.length > 0}
                            {#each listings as listing (listing.id)}
                                <ListingRow
                                    {listing}
                                    selected={selectedListingIds.has(listing.id)}
                                    editing={canEdit}
                                    onToggle={() => toggleListing(listing.id)}
                                    onSetPrice={console.log}
                                />
                            {/each}
                        {:else}
                            <div>No listings yet!</div>
                        {/if}
                    {:catch}
                        <div>Failed to load listings</div>
                    {/await} -->
                </livestream-listings>

                <livestream-start-stop>
                    <Button
                        onClick={() => startLivestream()}
                        disabled={livestreamId === null || livestreamData.active}
                    >Open room</Button>

                    <Button
                        onClick={() => stopLivestream()}
                        disabled={!livestreamData.active}
                    >Close room</Button>
                </livestream-start-stop>

                {#if livestreamData.active && livestreamId !== null}
                    <Backstage
                        userToken={store.user.streamioAuth.token}
                        userId={store.user.streamioAuth.id}
                        userName={store.user.streamioAuth.name}
                        {livestreamId}
                    />
                {/if}
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