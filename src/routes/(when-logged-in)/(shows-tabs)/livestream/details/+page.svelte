<script lang="ts">

import RichTextEntry from "@/RichTextEntry.svelte";
import { streamState, setStreamId } from "../store.svelte";
import Loading from "@/Loading.svelte";
import Button from "@/Button.svelte";
import { apiFetchAuthenticated } from "$routes/util";
    import { editStreamDetails } from "$api/api";


const streamId = $derived(streamState().id);
const streamData = $derived(streamState().data);

let newStreamData = $state<{
    title: string,
    description: string,
// svelte-ignore state_referenced_locally
}>(streamData);

$effect(() => {
    newStreamData = {...streamData};
});


const setLivestreamText = (text: string) => {
    if (newStreamData === null) return;

    newStreamData.title = text;
};

const setLivestreamDescription = (text: string) => {
    if (newStreamData === null) return;

    newStreamData.description = text;
};

const saveLivestreamData = async () => {
    if (newStreamData === null) return;

    // const validationResult = validate.listing({title: listing.title, description: listing.description});
    // if (!validationResult.ok) {
    //     return;
    // }

    if (streamId !== null) {
        await editStreamDetails({
            livestreamId: streamId,
            livestreamTitle: newStreamData.title,
            livestreamDescription: newStreamData.description,
        });
    } else {
        const {livestreamId} = await apiFetchAuthenticated<{livestreamId: string}>("livestream/new", {
            method: "PUT",
            body: JSON.stringify({
                livestreamTitle: newStreamData.title,
                livestreamDescription: newStreamData.description,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        setStreamId(livestreamId);
    }

    streamData.title = newStreamData.title;
    streamData.description = newStreamData.description;
};

const discardLivestreamData = () => {
    newStreamData.title = streamData.title;
    newStreamData.description = streamData.description;
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