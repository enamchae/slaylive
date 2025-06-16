<script lang="ts">
import type { Call, CustomVideoEvent } from "@stream-io/video-client";
    import RichTextEntry from "../../RichTextEntry.svelte";
    import SymbolButton from "../../SymbolButton.svelte";
    import { type LivestreamEvent, type LivestreamChatMessage, LivestreamEventType } from "./CallEvent";
    import { onDestroy, onMount } from "svelte";
    import Button from "../../Button.svelte";

let {
    call,
    userId,
    userName,
}: {
    userId: string,
    userName: string,
    call: Call,
} = $props();

let chatText = $state("");
let chatHistory = $state<LivestreamChatMessage[]>([]);


const onCustomEvent = (customEvent: CustomVideoEvent) => {
    if (customEvent.custom.type !== LivestreamEventType.Chat) return;
    const event = customEvent.custom as LivestreamEvent<LivestreamEventType.Chat>;

    chatHistory.push(event.data);
};

onMount(() => {
    call.on("custom", onCustomEvent);
});

onDestroy(() => {
    call.off("custom", onCustomEvent);
});


const sendChat = async () => {
    await call.sendCustomEvent({
        type: LivestreamEventType.Chat,
        data: {
            user: {
                id: userId,
                name: userName,
            },
            text: chatText,
        },
    } as LivestreamEvent);

    chatText = "";
};
</script>

<livestream-chat>
    <chat-history>
        {#each chatHistory as message}
            <chat-message>
                {message.user.name}: {message.text}
            </chat-message>
        {/each}
    </chat-history>

    <chat-entry>
        <RichTextEntry
            initialText={chatText}
            onInput={text => {
                chatText = text;
            }}
            placeholder="Write something…"
        />
        
        <Button
            onClick={sendChat}
        >
            Send
        </Button>
    </chat-entry>
</livestream-chat>

<style lang="scss">
chat-history {
    display: flex;
    flex-direction: column;
}
</style>