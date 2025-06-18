<script lang="ts">
import type { Call, CustomVideoEvent } from "@stream-io/video-client";
import StreamViewerInteraction from "@/stream/interaction/StreamViewerInteraction.svelte";
    import Tabber from "@/Tabber.svelte";
    import { LivestreamEventType, type LivestreamEvent } from "@/stream/interaction/CallEvent";
    import { onDestroy, onMount } from "svelte";
    import { getStreamInfo } from "$api/api";
    import WatchListing from "./WatchListing.svelte";

const {
    userId,
    userName,
    call,
    streamId,
}: {
    userId: string,
    userName: string,
    call: Call,
    streamId: string,
} = $props();

const tabs = {
    chat: "Chat",
    listings: "Listings",
};

let currentTab = $state(tabs.chat);


let streamInfo = $state<Awaited<ReturnType<typeof getStreamInfo>> | null>(null);

(async () => {
    streamInfo = await getStreamInfo({ streamId });
})();

const onCustomEvent = (customEvent: CustomVideoEvent) => {
    if (streamInfo === null) return;

    if (customEvent.custom.type !== LivestreamEventType.UpdateListing) return;
    const event = customEvent.custom as LivestreamEvent<LivestreamEventType.UpdateListing>;

    const listing = streamInfo.listings.find(listing => listing.id === event.data.listing.id);
    if (listing !== undefined) {
        listing.active = false;
    }
};

onMount(() => {
    call.on("custom", onCustomEvent);
});

onDestroy(() => {
    call.off("custom", onCustomEvent);
});
</script>

<watch-menu>
    {#if currentTab === tabs.chat}
        <StreamViewerInteraction
            {userId}
            {userName}
            {call}
        />
    {:else if currentTab === tabs.listings}
        {#if streamInfo !== null}
            {#each streamInfo.listings as listing (listing.id)}
                {#if listing.active}
                    <WatchListing {listing} />
                {/if}
            {/each}
        {/if}
    {/if}

    <Tabber
        currentLabel={currentTab}
        labels={Object.values(tabs)}
        onClickTab={tab => currentTab = tab}
    />
</watch-menu>