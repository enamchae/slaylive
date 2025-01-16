<script lang="ts">
import { onMount } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import { StreamVideoClient, type User, type StreamVideoParticipant } from "@stream-io/video-client";

import { PUBLIC_STREAM_API_KEY, PUBLIC_STREAM_TOKEN } from "$env/static/public";

let participants = new SvelteSet<StreamVideoParticipant>();
let video = $state<HTMLVideoElement | null>(null);

const apiKey = PUBLIC_STREAM_API_KEY;
const token = PUBLIC_STREAM_TOKEN;
const userId = 'Zam_Wesell';
const callId = 'tester';

// set up the user object
const user: User = {
    id: userId,
    name: 'Oliver',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

let nParticipants = $state(0);
let started = $state(false);

const client = new StreamVideoClient({ apiKey, token, user });
const call = client.call('livestream', callId);

onMount(() => {
    call.join({ create: true }).then(() => {
        call.camera.enable();
        call.microphone.enable();
    });


    // Render local participant's video
    call.state.localParticipant$.subscribe((localParticipant) => {
        if (!localParticipant) return;

        participants.add(localParticipant);

        // registers subscription updates and stream changes
        const unbind = call.bindVideoElement(
            video!,
            localParticipant.sessionId,
            "videoTrack"
        );
    });

    // Render the number of users who joined
    call.state.participantCount$.subscribe((count) => {
        nParticipants = count || 0;
    });

    call.state.backstage$.subscribe((backstage) => {
        started = !backstage;
    });
});
</script>

<div>Live: <span>{nParticipants}</span></div>
<video bind:this={video}></video>
<button
    onclick={() => call.goLive()}
    disabled={started}
>Go live</button>
<button
    onclick={() => call.stopLive()}
    disabled={!started}
>Stop live</button>

<style lang="scss">
video {
    object-fit: contain;
}
</style>