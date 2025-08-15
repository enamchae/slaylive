<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { store } from "$routes/store.svelte";
import { api } from "$api/client";
import { validate } from "$/lib/shared/validation";

import Button from "@/Button.svelte";
import TextInput from "@/TextInput.svelte";

let username = $state("");
let isSubmitting = $state(false);
let errors = $state<string[]>([]);

const handleSubmit = async () => {
    if (store.user === null) return;

    errors = [];

    const validationResult = validate.username({ name: username });
    if (!validationResult.ok) {
        errors = validationResult.errors;
        return;
    }

    isSubmitting = true;

    try {
        await api.user.edit({
            name: username,
        });
        
        await api.stripe.customer.create({});

        store.user = {
            ...store.user,
            name: username,
            streamioAuth: {
                ...store.user.streamioAuth,
                name: username,
            },
            hasFinishedProfileSetup: true,
        };

        goto("/now-live");
    } catch (error) {
        errors = ["Failed to update profile. Please try again."];
    } finally {
        isSubmitting = false;
    }
};

const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !isSubmitting) {
        handleSubmit();
    }
};
</script>

<main>
    <onboarding-form>
        <TextInput
            label="Username"
            bind:value={username}
            placeholder="Enter your username"
            disabled={isSubmitting}
            onInput={() => errors = []}
        />

        {#if errors.length > 0}
            <error-list>
                {#each errors as error}
                    <error-item>{error}</error-item>
                {/each}
            </error-list>
        {/if}

        <button-container>
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting || username.trim().length === 0}
                strong
            >
                {isSubmitting ? "Setting up..." : "Continue"}
            </Button>
        </button-container>
    </onboarding-form>
</main>

<svelte:window onkeypress={handleKeyPress} />

<style lang="scss">
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
}

onboarding-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    max-width: 400px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 2rem;
    padding: 3rem 2rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);
}

onboarding-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    width: 100%;
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

button-container {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}
</style>