<script lang="ts">
import Backstage from "$stories/Backstage.svelte";

import {store} from "$routes/store.svelte";
import { goto } from "$app/navigation";
import RichTextEntry from "$/stories/RichTextEntry.svelte";
import { apiFetch, apiFetchAuthorized } from "$/routes/util";
import SubtleExclamation from "$/stories/SubtleExclamation.svelte";
import ListingDisplayList from "$/stories/Listing/ListingDisplayList.svelte";
    import { SvelteSet } from "svelte/reactivity";

if (!store.isSeller) {
    goto("/");
}

const searchParams = new URLSearchParams(location.search);

let editing = $state((searchParams.has("new") || searchParams.has("edit")) && (store.user?.canSell ?? false));
const livestreamId = searchParams.get("id");

const livestreamPromise = livestreamId === null
    ? Promise.resolve({title: "", description: ""})
    : apiFetchAuthorized(`livestream/details?livestreamId=${livestreamId}`);

let livestream = $state<{
    title: string,
    description: string,
} | null>(null);

let selectedListingIds = $state(new SvelteSet<string>());

(async () => {
    const response = await livestreamPromise;
    livestream = {
        title: response.title,
        description: response.description,
    };
})();

let callStarted = $state(false);

const saveLivestream = async () => {
    if (livestream === null) return;

    // const validationResult = validate.listing({title: listing.title, description: listing.description});
    // if (!validationResult.ok) {
    //     return;
    // }

    if (livestreamId !== null) {
        await apiFetchAuthorized("livestream/edit", {
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
        await apiFetchAuthorized("livestream/new", {
            method: "PUT",
            body: JSON.stringify({
                livestreamTitle: livestream.title,
                livestreamDescription: livestream.description,
                livestreamListingIds: [...selectedListingIds],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
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
</script>


{#if store.isSeller && store.user !== null}
    {#await livestreamPromise}
        <div>Loading livestream...</div>
    {:then}
        {#if livestream !== null}
            <livestream-dashboard>
                <div>
                    <SubtleExclamation>You're editing this livestream!</SubtleExclamation>
                    <div>
                        <button onclick={saveLivestream}>Save</button>
                    </div>
                </div>

                
                <h1>livestream</h1>

                <livestream-title>
                    {#if editing}
                        <RichTextEntry
                            initialText={livestream.title}
                            onInput={text => livestream !== null && (livestream.title = text)}
                            placeholder="stream title"
                        />
                    {:else}
                        <div>{livestream.title}</div>
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

                    {#await apiFetch(`listing/by-seller?sellerUserId=${store.user.id}`)}
                        <div>Loading listings...</div>
                    {:then response}
                        {@const listings = response.listings}
        
                        {#if listings.length > 0}
                            <ListingDisplayList
                                {listings}
                                onClickListing={listing => editing && toggleListing(listing.id)}
                                selectedIds={selectedListingIds}
                            />
                        {:else}
                            <div>No listings yet!</div>
                        {/if}
                    {:catch}
                        <div>Failed to load listings</div>
                    {/await}
                </livestream-listings>


                <button onclick={() => callStarted = true}>Start</button>

                {#if callStarted}
                    <Backstage
                        userToken={store.user.streamioAuth.token}
                        userId={store.user.streamioAuth.id}
                        userName={store.user.streamioAuth.name}
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

    :is(livestream-title, livestream-description) {
        border: 1px dashed #afafaf;
    }
}

livestream-title {
    font-size: 1.75rem;
    font-weight: 100;
}
</style>