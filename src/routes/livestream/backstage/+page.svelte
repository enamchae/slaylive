<script lang="ts">
import Backstage from "$stories/Backstage.svelte";

import {store} from "$routes/store.svelte";
import { goto } from "$app/navigation";
    import RichTextEntry from "$/stories/RichTextEntry.svelte";
    import { apiFetch, apiFetchAuthorized } from "$/routes/util";
    import SubtleExclamation from "$/stories/SubtleExclamation.svelte";

if (!store.isSeller) {
    goto("/");
}

const searchParams = new URLSearchParams(location.search);

const livestreamId = searchParams.get("id");

const livestreamPromise = livestreamId === null
    ? Promise.resolve({title: "", description: ""})
    : apiFetchAuthorized(`livestream/details/backstage?livestreamId=${livestreamId}`);

let livestream = $state<{
    title: string,
    description: string,
} | null>(null);

(async () => {
    const response = await livestreamPromise;
    livestream = {
        title: response.title,
        description: response.description,
    };
})();

let callStarted = $state(false);

const saveLivestream = () => {

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
                    <RichTextEntry
                        initialText={livestream.title}
                        onInput={text => livestream !== null && (livestream.title = text)}
                        placeholder="stream title"
                    />
                </livestream-title>

                <livestream-description>
                    <RichTextEntry
                        initialText={livestream.description}
                        onInput={text => livestream !== null && (livestream.description = text)}
                        placeholder="stream description"
                    />
                </livestream-description>

                <livestream-listings>
                    <h2>listings</h2>
                </livestream-listings>

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