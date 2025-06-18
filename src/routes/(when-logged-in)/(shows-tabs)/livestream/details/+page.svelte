<script lang="ts">

import RichTextEntry from "@/RichTextEntry.svelte";
import { streamState, setStreamId, fetchStreamData } from "../store.svelte";
    import Loading from "@/Loading.svelte";
    import Button from "@/Button.svelte";
    import { apiFetchAuthenticated } from "$routes/util";


let streamData = $state<{
    title: string,
    description: string,
} | null>(null);

let lastSavedStreamData = $state<{
    title: string,
    description: string,
} | null>(null);


$effect(() => {
    (async () => {
        const data = await fetchStreamData(streamState().id);

        streamData = {
            title: data.title,
            description: data.description,
        };

        lastSavedStreamData = {...streamData};
    })();
});


const setLivestreamText = (text: string) => {
    if (streamData === null) return;

    streamData.title = text;
};

const setLivestreamDescription = (text: string) => {
    if (streamData === null) return;

    streamData.description = text;
};

const saveLivestreamData = async () => {
    if (streamData === null) return;

    // const validationResult = validate.listing({title: listing.title, description: listing.description});
    // if (!validationResult.ok) {
    //     return;
    // }

    if (streamState().id !== null) {
        await apiFetchAuthenticated("livestream/edit", {
            method: "PATCH",
            body: JSON.stringify({
                livestreamId: streamState().id,
                livestreamTitle: streamData.title,
                livestreamDescription: streamData.description,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } else {
        const {livestreamId} = await apiFetchAuthenticated<{livestreamId: string}>("livestream/new", {
            method: "PUT",
            body: JSON.stringify({
                livestreamTitle: streamData.title,
                livestreamDescription: streamData.description,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        setStreamId(livestreamId);
    }

    lastSavedStreamData = {...streamData};
};

const discardLivestreamData = () => {
    if (lastSavedStreamData === null) return;
    
    streamData = {...lastSavedStreamData};
};
</script>


<stream-details>
    {#if streamData === null}
        <Loading />
    {:else}
        <stream-title>
            <RichTextEntry
                label="stream title"
                initialText={streamData.title}
                onInput={setLivestreamText}
                placeholder="stream title"
                classes="heading heading-1"
            />
        </stream-title>

        <livestream-description>
            <RichTextEntry
                label="stream description"
                initialText={streamData.description}
                onInput={setLivestreamDescription}
                placeholder="stream description"
            />
        </livestream-description>

        <save-discard-buttons>
            <Button
                onClick={() => saveLivestreamData()}
                strong
            >Save</Button>

            <Button
                onClick={() => discardLivestreamData()}
            >Discard</Button>
        </save-discard-buttons>
    {/if}
</stream-details>

<style lang="scss">
stream-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > * {
        margin: 0 1rem;
    }
}

stream-title {
    font-size: 1.75rem;
    font-weight: 100;
}
</style>