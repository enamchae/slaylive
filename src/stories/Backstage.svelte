<script lang="ts">
import {onMount} from "svelte";
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant } from "@stream-io/video-client";

import { PUBLIC_STREAM_API_KEY, PUBLIC_API_URL } from "$env/static/public";
import ParticipantVideo from "./ParticipantVideo.svelte";

const {
    userToken,
    userId,
    userName,
}: {
    userToken: string,
    userId: string,
    userName: string,
} = $props();

// set up the user object
const user: User = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_svg/?id=${userId}&name=${userName}`,
};

let nParticipants = $state(0);
let started = $state(false);

let call = $state<Call | null>(null);
let callId = $state<string | null>(null);
let localParticipant = $state<StreamVideoParticipant | null>(null);

(async () => {
    const callResponse = await fetch(new URL("livestream/start", PUBLIC_API_URL), {
        method: "post",
        body: JSON.stringify({
            userId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!callResponse.ok) {
        alert(callResponse.statusText)
        return;
    }

    
    ({callId} = await callResponse.json());

    if (!callId) return;

    const client = new StreamVideoClient({ apiKey: PUBLIC_STREAM_API_KEY, token: userToken, user });
    call = client.call('livestream', callId);

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

        localParticipant = participant;

        fetch(new URL("livestream/set-host-session", PUBLIC_API_URL).href, {
            method: "put",
            body: JSON.stringify({
                callId,
                sessionId: participant.sessionId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    // Render the number of users who joined
    call.state.participantCount$.subscribe((count) => {
        nParticipants = count || 0;
    });

    call.state.backstage$.subscribe((backstage) => {
        started = !backstage;
    });
    
})();
</script>

<backstage-container>
    <div>Call id: {callId}</div>
    <div>Live: {nParticipants}</div>
    {#if call !== null}
        {#if localParticipant !== null}
            <ParticipantVideo
                {call}
                sessionId={localParticipant.sessionId}
            />
        {/if}
    
        <button
            onclick={() => call?.goLive()}
            disabled={started}
        >Go live</button>
        <button
            onclick={() => call?.stopLive()}
            disabled={!started}
        >Stop live</button>
    {/if}
</backstage-container>

<style lang="scss">
backstage-container {
    display: flex;
    flex-direction: column;
}

video {
    object-fit: contain;
}
</style>