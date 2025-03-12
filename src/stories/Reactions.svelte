<script lang="ts">
import type { Call, CustomVideoEvent } from "@stream-io/video-client";
import RichTextEntry from "./RichTextEntry.svelte";
import SymbolButton from "./SymbolButton.svelte";
import type { CallEvent, LivestreamReaction } from "./CallEvent";
import { onDestroy, onMount } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import Reaction from "./Reaction.svelte";

let {
    call,
}: {
    call: Call,
} = $props();

let recentReactions = $state(new SvelteSet<{
    reaction: LivestreamReaction,
    uuid: string,
}>());


const onCustomEvent = (customEvent: CustomVideoEvent) => {
    const event = customEvent.custom as CallEvent;
    if (event.type !== "react") return;

    recentReactions.add({
        reaction: event.data,
        uuid: crypto.randomUUID(),
    });
};

onMount(() => {
    call.on("custom", onCustomEvent);
});

onDestroy(() => {
    call.off("custom", onCustomEvent);
});


const sendChat = async (emoji: string) => {
    await call.sendCustomEvent({
        type: "react",
        data: {
            emoji,
        },
    });
};
</script>

<livestream-reactions-visualizer>
    {#each recentReactions as item (item.uuid)}
        <Reaction
            emoji={item.reaction.emoji}
            onAnimationEnd={() => recentReactions.delete(item)}
        />
    {/each}
</livestream-reactions-visualizer>

<livestream-reactions-rack>
    <button onclick={() => sendChat("🤣")}>🤣</button>
    <button onclick={() => sendChat("🤩")}>🤩</button>
    <button onclick={() => sendChat("😍")}>😍</button>
    <button onclick={() => sendChat("❤️")}>❤️</button>
</livestream-reactions-rack>

<style lang="scss">
chat-history {
    display: flex;
    flex-direction: column;
}
</style>