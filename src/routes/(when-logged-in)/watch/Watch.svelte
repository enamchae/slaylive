<script lang="ts">
import { StreamVideoClient, type Call, type User, type StreamVideoParticipant } from "@stream-io/video-client";
import { onDestroy } from "svelte";

import { PUBLIC_STREAM_API_KEY } from "$env/static/public";
import ParticipantVideo from "@/stream/ParticipantVideo.svelte";
    import Button from "@/Button.svelte";
    import WatchMenu from "./WatchMenu.svelte";
    import { api } from "$api/client";
    import { store } from "$routes/store.svelte";
    import type { Listing } from "../(shows-tabs)/livestream/Listing";
    import StripeCheckoutPopover from "@/stripe/StripeCheckoutPopover.svelte";

let {
    streamId,
    userToken,
    userId,
    userName,
}: {
    streamId: string,
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
    call = client.call('livestream', streamId);

    await call.join();

    ({hostSessionId} = await api.stream.getHost({call_id: streamId}));


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


let isProcessingPayment = $state(false);
let paymentError = $state<string | null>(null);
let showCheckoutPopover = $state(false);
let checkoutClientSecret = $state<string | null>(null);

const handlePurchase = async (listing: Listing) => {
    if (!store.user) {
        paymentError = "Please log in to make a purchase";
        return;
    }

    isProcessingPayment = true;
    paymentError = null;

    try {
        // const paymentIntentResponse = await api.stripe.paymentIntent.create({
        //     listingId: listing.id,
        //     streamId: streamId,
        // });

        // await Stripe.createPaymentSheet({
        //     paymentIntentClientSecret: paymentIntentResponse.clientSecret,
        //     customerId: paymentIntentResponse.customerId,
        //     customerEphemeralKeySecret: paymentIntentResponse.ephemeralKey,
        //     merchantDisplayName: `SLAY - ${paymentIntentResponse?.seller.name}`,
        // });

        // const result = await Stripe.presentPaymentSheet();

        // if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
        //     // Payment successful
        //     console.log('Payment successful!', result);
        //     paymentError = null;
        //     // You could show a success message or update the UI here
        // } else {
        //     paymentError = "Payment was not completed";
        // }

        const checkoutResponse = await api.stripe.checkout.session({
            listingId: listing.id,
            streamId: streamId,
        });

        checkoutClientSecret = checkoutResponse.clientSecret;
        showCheckoutPopover = true;
        isProcessingPayment = false;
        
    } catch (error) {
        console.error('Payment failed:', error);
        paymentError = error instanceof Error ? error.message : "Payment failed. Please try again.";
        isProcessingPayment = false;
    }
};

const handleCheckoutClose = () => {
    showCheckoutPopover = false;
    checkoutClientSecret = null;
};

const handleCheckoutSuccess = () => {
    showCheckoutPopover = false;
    checkoutClientSecret = null;
    // You could show a success message or refresh the page
    paymentError = null;
    console.log('Payment successful!');
};
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
            <Button
                onClick={() => history.back()}
            >
                &lt;
            </Button>
        </watch-exit>

        {#if call !== null}
            <WatchMenu
                {userId}
                {userName}
                {call}
                {streamId}
                onPurchase={handlePurchase}
                {paymentError}
                {isProcessingPayment}
            />
        {/if}


        {#if showCheckoutPopover && checkoutClientSecret}
            <StripeCheckoutPopover
                sessionId={checkoutClientSecret}
                onClose={handleCheckoutClose}
                onSuccess={handleCheckoutSuccess}
            />
        {/if}
    </watch-overlays>
</watch-container>

<style lang="scss">
watch-container {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    background: #251c22;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

</style>