<script lang="ts">
import type { Call, CustomVideoEvent } from "@stream-io/video-client";
import StreamViewerInteraction from "@/stream/interaction/StreamViewerInteraction.svelte";
    import Tabber from "@/Tabber.svelte";
    import { LivestreamEventType, type LivestreamEvent } from "@/stream/interaction/CallEvent";
    import { onDestroy, onMount } from "svelte";
    import { api } from "$api/client";
    import WatchListing from "./WatchListing.svelte";
    import type { Listing } from "../(shows-tabs)/livestream/Listing";

const {
    userId,
    userName,
    call,
    streamId,
    onPurchase,
    paymentError = null,
    isProcessingPayment = false,
}: {
    userId: string,
    userName: string,
    call: Call,
    streamId: string,
    onPurchase: (listing: Listing) => void,
    paymentError?: string | null,
    isProcessingPayment?: boolean,
} = $props();

const tabs = {
    chat: "Chat",
    listings: "Listings",
};

let currentTab = $state(tabs.chat);


let streamInfo = $state<Awaited<ReturnType<typeof api.stream.details>> | null>(null);

(async () => {
    streamInfo = await api.stream.details({ streamId });
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
        <watch-listings>
            {#if streamInfo !== null}
                {#each streamInfo.listings as listing (listing.id)}
                    {#if listing.active}
                        <WatchListing
                            {listing}
                            {streamId}
                            onPurchase={() => onPurchase(listing)}
                            {paymentError}
                            {isProcessingPayment}
                        />
                    {/if}
                {/each}
            {/if}
        </watch-listings>
    {/if}

    <Tabber
        currentLabel={currentTab}
        labels={Object.values(tabs)}
        onClickTab={tab => currentTab = tab}
    />
</watch-menu>

<style lang="scss">
watch-listings {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    max-height: 40vh;
    overflow-y: auto;

    mask: linear-gradient(#0000, #000 calc(2rem), #000 calc(100% - 2rem), #0000);
    padding: 2rem 0;
}
</style>