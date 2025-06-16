<script lang="ts">
import type { Call, CustomVideoEvent } from "@stream-io/video-client";
import RichTextEntry from "./RichTextEntry.svelte";
import SymbolButton from "./SymbolButton.svelte";
import { LivestreamEventType, type LivestreamEvent, type LivestreamReaction } from "./CallEvent";
import { onDestroy, onMount } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import Reaction from "./Reaction.svelte";
    import Button from "./Button.svelte";

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
    if (customEvent.custom.type !== LivestreamEventType.React) return;
    const event = customEvent.custom as LivestreamEvent<LivestreamEventType.React>;

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


const sendReaction = async (emoji: string) => {
    await call.sendCustomEvent({
        type: LivestreamEventType.React,
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
    <Button onClick={() => sendReaction("🤣")}>🤣</Button>
    <Button onClick={() => sendReaction("🤩")}>🤩</Button>
    <Button onClick={() => sendReaction("😍")}>😍</Button>
    <Button onClick={() => sendReaction("❤️")}>❤️</Button>
</livestream-reactions-rack>

<style lang="scss">
chat-history {
    display: flex;
    flex-direction: column;
}
</style>