<script lang="ts">
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant, type EventTypes } from "@stream-io/video-client";
import { onDestroy } from "svelte";
import {goto} from "$app/navigation";

import { PUBLIC_STREAM_API_KEY, PUBLIC_API_URL } from "$env/static/public";
import ParticipantVideo from "./ParticipantVideo.svelte";
import SymbolButton from "./SymbolButton.svelte";
import RichTextEntry from "./RichTextEntry.svelte";
import type { CallEvent, ChatMessage } from "./CallEvent";
    import Chat from "./Chat.svelte";

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
            <SymbolButton
                onClick={() => goto("/now-live")}
            >
                &lt;
            </SymbolButton>
        </watch-exit>

        <watch-chat>
            {#if call !== null}
                <Chat
                    {userId}
                    {userName}
                    {call}
                />
            {/if}
        </watch-chat>
    </watch-overlays>
</watch-container>

<style lang="scss">
watch-container {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    background: #1a1d1c;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    > watch-exit {
        grid-area: 1/1;
    }

    > watch-chat {
        grid-area: 2/2;
        align-self: flex-end;
    }
}

</style>