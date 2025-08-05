<script lang="ts">
    import { api } from "$api/client";
    import { goto } from "$app/navigation";
    import { store } from "$routes/store.svelte";
    import Button from "@/Button.svelte";
    import ListingDisplay from "@/listing/ListingDisplay.svelte";
    import StripeCheckoutPopover from "@/stripe/StripeCheckoutPopover.svelte";
    import type { Listing } from "../(shows-tabs)/livestream/Listing";
    // import { PaymentSheetEventsEnum, Stripe } from "@capacitor-community/stripe";

const {
    listing,
    streamId,
    onPurchase,
    paymentError = null,
    isProcessingPayment = false,
}: {
    listing: Awaited<ReturnType<typeof api.stream.details>>["listings"][0],
    streamId: string,
    onPurchase: () => void,
    paymentError?: string | null,
    isProcessingPayment?: boolean,
} = $props();
</script>

<watch-listing>
    <listing-display>
        <ListingDisplay
            title={listing.title}
        />
    </listing-display>

    <listing-top>
        <h2>{listing.title}</h2>

        <purchase-section>
            <Button
                onClick={onPurchase}
                disabled={isProcessingPayment}
                strong
            >
                {#if isProcessingPayment}
                    Processing...
                {:else}
                    Buy ${listing.price}
                {/if}
            </Button>

            {#if paymentError}
                <payment-error>{paymentError}</payment-error>
            {/if}
        </purchase-section>
    </listing-top>

    <listing-description>
        {listing.description}
    </listing-description>
</watch-listing>

<style lang="scss">
watch-listing {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
}

listing-display {
    grid-area: 1/1;
    place-self: center;
}

listing-top {
    display: flex;
    flex-direction: column;

    grid-area: 1/2;
}

listing-description {
    grid-area: 2/1 / 3/3;
}

purchase-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

payment-error {
    color: #ff6b6b;
    font-size: 0.8rem;
    text-align: center;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 0.25rem;
    border: 1px solid rgba(255, 107, 107, 0.3);
}
</style>