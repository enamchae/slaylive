<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { store } from "$routes/store.svelte";
import { api } from "$api/client";
import TextInput from "@/TextInput.svelte";
import Button from "@/Button.svelte";

let billingName = $state(store.user?.name ?? "");
let billingPhone = $state("");
let savePaymentMethod = $state(false);
let isSubmitting = $state(false);
let errors = $state<string[]>([]);

const handleSkip = async () => {
    isSubmitting = true;
    try {
        goto("/now-live");
    } finally {
        isSubmitting = false;
    }
};

const handleSubmit = async () => {
    if (store.user === null) return;
    
    errors = [];

    if (billingName.trim().length === 0) {
        errors.push("Name is required");
    }

    if (errors.length > 0) return;

    isSubmitting = true;

    try {
        await api.stripe.customer.create({
            name: billingName,
            phone: billingPhone || undefined,
        });

        store.user.hasFinishedProfileSetup = true;

        goto("/now-live");
    } catch (error) {
        errors = ["Failed to set up billing information. Please try again."];
    } finally {
        isSubmitting = false;
    }
};

onMount(() => {
    if (store.user?.hasFinishedProfileSetup ?? false) {
        goto("/now-live");
    }
});
</script>

<main>
    <onboarding-container>
        <onboarding-header>
            <h1>Billing Information</h1>
            <p>Set up your billing details to make purchases (optional)</p>
        </onboarding-header>

        <onboarding-form>

            <TextInput
                label="Full Name"
                bind:value={billingName}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                onInput={() => errors = []}
            />

            <TextInput
                label="Phone (Optional)"
                bind:value={billingPhone}
                placeholder="Enter your phone number"
                disabled={isSubmitting}
                onInput={() => errors = []}
            />

            <checkbox-container>
                <label>
                    <input
                        type="checkbox"
                        bind:checked={savePaymentMethod}
                        disabled={isSubmitting}
                    />
                    <span>Set up payment method now</span>
                </label>
            </checkbox-container>

            {#if errors.length > 0}
                <error-list>
                    {#each errors as error}
                        <error-item>{error}</error-item>
                    {/each}
                </error-list>
            {/if}

            <button-container>
                <Button
                    onClick={handleSkip}
                    disabled={isSubmitting}
                >
                    Skip for now
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || billingName.trim().length === 0}
                    strong
                >
                    {isSubmitting ? "Setting up..." : "Continue"}
                </Button>
            </button-container>
        </onboarding-form>
    </onboarding-container>
</main>

<style lang="scss">
main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #1a0a0a, #2d1b1b);
}

onboarding-container {
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

onboarding-header {
    text-align: center;

    h1 {
        margin-bottom: 0.5rem;
        color: #fff;
    }

    p {
        color: #ccc;
        margin: 0;
    }
}

onboarding-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

checkbox-container {
    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: #ccc;

        input[type="checkbox"] {
            width: 1rem;
            height: 1rem;
            accent-color: #A910B1;
        }

        span {
            font-size: 0.9rem;
        }
    }
}

button-container {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-top: 1rem;
}

error-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

error-item {
    color: #ff6b6b;
    font-size: 0.9rem;
    padding: 0.5rem;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 0.5rem;
    border-left: 3px solid #ff6b6b;
}
</style>