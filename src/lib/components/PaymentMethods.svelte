<script lang="ts">
import { onMount } from "svelte";
import { api } from "$api/client";
import { store } from "$routes/store.svelte";
import Button from "@/Button.svelte";

interface PaymentMethod {
    id: string;
    type: string;
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    } | null;
}

let paymentMethods = $state<PaymentMethod[]>([]);
let isLoading = $state(true);
let error = $state<string | null>(null);
let deletingId = $state<string | null>(null);

const loadPaymentMethods = async () => {
    if (!store.user) return;

    try {
        isLoading = true;
        error = null;

        const response = await api.stripe.paymentMethods.list({}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.user.supabaseAccessToken}`,
            },
        });

        paymentMethods = response.paymentMethods;
    } catch (err) {
        console.error("Failed to load payment methods:", err);
        error = "Failed to load payment methods";
    } finally {
        isLoading = false;
    }
};

const deletePaymentMethod = async (paymentMethodId: string) => {
    if (!store.user) return;

    try {
        deletingId = paymentMethodId;
        error = null;

        await api.stripe.paymentMethods.delete({
            paymentMethodId,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.user.supabaseAccessToken}`,
            },
        });

        // Remove from local list
        paymentMethods = paymentMethods.filter(pm => pm.id !== paymentMethodId);
    } catch (err) {
        console.error("Failed to delete payment method:", err);
        error = "Failed to delete payment method";
    } finally {
        deletingId = null;
    }
};

onMount(() => {
    loadPaymentMethods();
});
</script>

<payment-methods-container>
    <payment-methods-header>
        <h3>Payment Methods</h3>
        <Button onClick={loadPaymentMethods} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
        </Button>
    </payment-methods-header>

    {#if error}
        <error-message>{error}</error-message>
    {/if}

    {#if isLoading}
        <loading-message>Loading payment methods...</loading-message>
    {:else if paymentMethods.length === 0}
        <empty-message>
            <p>No payment methods saved</p>
            <p>Payment methods will be saved when you make your first purchase</p>
        </empty-message>
    {:else}
        <payment-methods-list>
            {#each paymentMethods as method (method.id)}
                <payment-method-item>
                    <payment-method-info>
                        {#if method.card}
                            <payment-method-brand>
                                {method.card.brand.toUpperCase()}
                            </payment-method-brand>
                            <payment-method-details>
                                •••• •••• •••• {method.card.last4}
                            </payment-method-details>
                            <payment-method-expiry>
                                Expires {method.card.exp_month.toString().padStart(2, '0')}/{method.card.exp_year}
                            </payment-method-expiry>
                        {:else}
                            <payment-method-details>
                                {method.type} payment method
                            </payment-method-details>
                        {/if}
                    </payment-method-info>

                    <payment-method-actions>
                        <Button
                            onClick={() => deletePaymentMethod(method.id)}
                            disabled={deletingId === method.id}
                        >
                            {deletingId === method.id ? "Removing..." : "Remove"}
                        </Button>
                    </payment-method-actions>
                </payment-method-item>
            {/each}
        </payment-methods-list>
    {/if}
</payment-methods-container>

<style lang="scss">
payment-methods-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
}

payment-methods-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        margin: 0;
        color: #fff;
    }
}

error-message {
    color: #ff6b6b;
    padding: 0.75rem;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 0.5rem;
    border-left: 3px solid #ff6b6b;
}

loading-message {
    text-align: center;
    padding: 2rem;
    color: #ccc;
}

empty-message {
    text-align: center;
    padding: 2rem;
    color: #ccc;

    p {
        margin: 0.5rem 0;
    }
}

payment-methods-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

payment-method-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

payment-method-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

payment-method-brand {
    font-weight: bold;
    font-size: 0.8rem;
    color: #A910B1;
    text-transform: uppercase;
}

payment-method-details {
    font-family: monospace;
    font-size: 1rem;
    color: #fff;
}

payment-method-expiry {
    font-size: 0.8rem;
    color: #ccc;
}

payment-method-actions {
    display: flex;
    gap: 0.5rem;
}
</style>
