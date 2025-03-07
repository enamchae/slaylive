<script lang="ts">
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant } from "@stream-io/video-client";

import { PUBLIC_STREAM_API_KEY, PUBLIC_API_URL } from "$env/static/public";
import ParticipantVideo from "./ParticipantVideo.svelte";

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
})();

</script>

<watch-container>
    <div>Live: {nParticipants}</div>
    {#if call !== null && hostSessionId !== null}
        <ParticipantVideo
            {call}
            sessionId={hostSessionId}
        />
    {/if}
</watch-container>

<style lang="scss">
watch-container {
    display: flex;
    flex-direction: column;

    height: 100vh;
}

video {
    object-fit: contain;
}
</style>