<script lang="ts">
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant } from "@stream-io/video-client";

import { PUBLIC_STREAM_API_KEY, PUBLIC_API_URL } from "$env/static/public";
import ParticipantVideo from "./ParticipantVideo.svelte";
    import { onDestroy } from "svelte";

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

    ({hostSessionId} = await (await fetch(new URL(`/api/livestream/get-host?call_id=${callId}`, PUBLIC_API_URL).href)).json());


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

            <div>
                <ParticipantVideo
                    {call}
                    sessionId={hostSessionId}
                    hasShadow
                />
            </div>
        {/if}
    {:else}
        Call over! Thanks for watching!
    {/if}
</watch-container>

<style lang="scss">
watch-container {
    display: grid;
    place-items: center;
    height: 100vh;
    background: #1a1d1c;
    color: #fff;

    > * {
        grid-area: 1/1;
    }
}

video-backdrop {
    height: 100%;
}
</style>