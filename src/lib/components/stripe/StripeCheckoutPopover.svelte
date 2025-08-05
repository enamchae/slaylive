<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { getStripe } from '$lib/stripe/client';
import type { StripeEmbeddedCheckout } from '@stripe/stripe-js';

const {
    sessionId,
    onClose,
    onSuccess = () => {},
}: {
    sessionId: string;
    onClose: () => void;
    onSuccess?: () => void;
} = $props();

let checkoutDiv: HTMLDivElement;
let embeddedCheckout: StripeEmbeddedCheckout | null = null;
let isLoading = $state(true);
let error = $state<string | null>(null);

onMount(async () => {
    try {
        const stripe = await getStripe();
        if (!stripe) {
            isLoading = false;
            return;
        }

        // Create embedded checkout
        embeddedCheckout = await stripe.initEmbeddedCheckout({
            clientSecret: sessionId,
            onComplete: () => {
                // Payment completed successfully
                onSuccess();
                onClose();
            }
        });

            console.log("hello");
        // Mount the checkout to the div
        if (checkoutDiv) {
            embeddedCheckout.mount(checkoutDiv);
        }
        
        isLoading = false;
    } catch (err) {
        console.error('Failed to initialize embedded checkout:', err);
        error = err instanceof Error ? err.message : 'Failed to load checkout';
        isLoading = false;
    }
});

onDestroy(() => {
    if (embeddedCheckout) {
        embeddedCheckout.destroy();
    }
});

const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
};
</script>

<checkout-overlay onclick={handleOverlayClick}>
    <checkout-container>
        <checkout-header>
            <h3>Complete Your Purchase</h3>
            <close-button onclick={onClose}>✕</close-button>
        </checkout-header>
        
        {#if isLoading}
            <loading-container>
                <loading-spinner />
                <p>Loading checkout...</p>
            </loading-container>
        {/if}
        <checkout-content>
            <div bind:this={checkoutDiv}></div>
        </checkout-content>
    </checkout-container>
</checkout-overlay>

<style lang="scss">
    checkout-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
    }

    checkout-container {
        background: #fff;
        border-radius: 1rem;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    checkout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;

        h3 {
            margin: 0;
            color: #1a1a1a;
        }
    }

    close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        transition: color 0.2s;

        &:hover {
            color: #1a1a1a;
        }
    }

    checkout-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
    }

    loading-container, error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        gap: 1rem;
        color: #4b5563;
    }

    error-container {
        button {
            padding: 0.5rem 1rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;

            &:hover {
                background: #2563eb;
            }
        }
    }

    loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style> 