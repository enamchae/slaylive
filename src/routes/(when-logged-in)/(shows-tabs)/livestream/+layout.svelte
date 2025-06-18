<script lang="ts">
import { onDestroy, type Snippet } from "svelte";
import { assignCallData, resetStreamData, setCallData, streamState } from "./store.svelte";
import { goto } from "$app/navigation";
    import { store } from "$routes/store.svelte";
    import Tabber from "@/Tabber.svelte";
    import PageScroller from "@/PageScroller.svelte";
    import { StreamVideoClient, type Call, type StreamVideoParticipant, type User } from "@stream-io/video-client";
    import { PUBLIC_STREAM_API_KEY } from "$env/static/public";
    import { setHostSession } from "$api/api";


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
});



const streamId = $derived(streamState().id);

let streamioUser = $derived(
    store.user === null
        ? null
        : <User>{
            id: store.user.streamioAuth.id,
            name: store.user.name,
            image: `https://getstream.io/random_svg/?id=${store.user.streamioAuth.id}&name=${store.user.name}`,
        }
);


const callData = $derived(streamState().callData);

$effect(() => {
    (async () => {
        if (streamId === null || store.user === null || streamioUser === null) return;

        const client = StreamVideoClient.getOrCreateInstance({
            apiKey: PUBLIC_STREAM_API_KEY,
            token: store.user.streamioAuth.token,
            user: streamioUser,
        });
        const call = client.call('livestream', streamId);

        setCallData({
            call,
            nParticipants: 0,
            localParticipant: null,
            started: false,
        });


        await call.join();
        
        try {
            await Promise.all([
                call.camera.enable(),
                call.microphone.enable(),
            ]);
        } catch (error) {
            alert(`Camera is inaccessible or permission was denied: ${error}`);
            return;
        }

        // Render local participant's video
        call.state.localParticipant$.subscribe(participant => {
            if (!participant) return;

            assignCallData({localParticipant: participant});

            setHostSession({
                livestreamId: streamId,
                sessionId: participant.sessionId,
            });
        });

        // Render the number of users who joined
        call.state.participantCount$.subscribe((count) => {
            assignCallData({nParticipants: count});
        });

        call.state.backstage$.subscribe((backstage) => {
            assignCallData({started: !backstage});
        });
    })();
});

onDestroy(() => {
    if (callData === null) return;

    callData.call.leave();
});

resetStreamData();
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