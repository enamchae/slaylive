<script lang="ts">
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant } from "@stream-io/video-client";
import { onDestroy } from "svelte";

import { PUBLIC_STREAM_API_KEY } from "$env/static/public";
import ParticipantVideo from "@/stream/ParticipantVideo.svelte";
    import Button from "@/Button.svelte";
    import WatchMenu from "./WatchMenu.svelte";
    import { getLivestreamHost } from "$api/api";

let {
    callId,
    userToken,
    userId,
    userName,
}: {
    callId: string,
    userToken: string,
    userId: string,
    userName: string,
} = $props();


// set up the user object
let user: User = $derived({
    id: userId,
    name: userName,
    image: `https://getstream.io/random_svg/?id=${userId}&name=${userName}`,
});

let nParticipants = $state(0);

let call = $state<Call | null>(null);
let hostSessionId = $state<string | null>(null);

let callOngoing = $state(true);



// $effect(() => {
//     if (host === null || video === null) return;

//     video.srcObject = host.videoStream ?? null;
// });

let participants = $state<StreamVideoParticipant[]>([]);

(async () => {
    const client = StreamVideoClient.getOrCreateInstance({ apiKey: PUBLIC_STREAM_API_KEY, token: userToken, user });
    call = client.call('livestream', callId);

    await call.join();

    ({hostSessionId} = await getLivestreamHost({call_id: callId}));


    // Render the number of users who joined
    call.state.participantCount$.subscribe((count) => {
        nParticipants = count || 0;
    });

    call.state.participants$.subscribe(items => {
        participants = items;
    });

    call.state.endedAt$.subscribe(date => {
        if (date === undefined) return;
        callOngoing = false;
    });
})();

onDestroy(() => {
    call?.leave();
});
</script>

<watch-container>
    {#if callOngoing}
        {#if call !== null && hostSessionId !== null}
            <video-backdrop>
                <ParticipantVideo
                    {call}
                    sessionId={hostSessionId}
                    isBackdrop
                />
            </video-backdrop>

            <video-main>
                <ParticipantVideo
                    {call}
                    sessionId={hostSessionId}
                    hasShadow
                />
            </video-main>
        {/if}
    {:else}
        Call over! Thanks for watching!
    {/if}

    <watch-overlays>
        <watch-exit>
            <Button
                onClick={() => history.back()}
            >
                &lt;
            </Button>
        </watch-exit>

        {#if call !== null}
            <WatchMenu
                {userId}
                {userName}
                {call}
            />
        {/if}

    </watch-overlays>
</watch-container>

<style lang="scss">
watch-container {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    background: #251c22;
    color: #fff;
    position: absolute;

    > * {
        grid-area: 1/1;
        position: absolute;
    }
}

video-backdrop {
    height: 100%;
}

watch-overlays {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

</style>