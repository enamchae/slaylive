<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import { store } from "$routes/store.svelte";
import { api } from "$api/client";
import { validate } from "$lib/validation";

import Button from "@/Button.svelte";
import TextInput from "@/TextInput.svelte";

let username = $state("");
let isSubmitting = $state(false);
let errors = $state<string[]>([]);

onMount(() => {
    // Redirect if user is not logged in
    if (store.user === null) {
        goto("/");
        return;
    }

    // Redirect if user has already finished profile setup
    if (store.user.finishedProfileSetup) {
        goto("/now-live");
        return;
    }

    // Pre-fill with existing name if available
    if (store.user.name && store.user.name !== store.user.id) {
        username = store.user.name;
    }
});

const handleSubmit = async () => {
    if (store.user === null) return;

    // Clear previous errors
    errors = [];

    // Validate username
    const validationResult = validate.username({ name: username });
    if (!validationResult.ok) {
        errors = validationResult.errors;
        return;
    }

    isSubmitting = true;

    try {
        const response = await api.user.updateProfile({
            name: username,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.user.supabaseAccessToken}`,
            },
        });

        // Update the store with the new user data
        store.user = {
            ...store.user,
            name: response.name,
            finishedProfileSetup: response.finishedProfileSetup,
            streamioAuth: {
                ...store.user.streamioAuth,
                name: response.name,
            },
        };

        // Redirect to the main app
        goto("/now-live");
    } catch (error) {
        console.error("Failed to update profile:", error);
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
    <onboarding-container>
        <onboarding-header>
            <h1>Welcome to SLAY!</h1>
            <p>Let's get you set up with a username</p>
        </onboarding-header>

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
    </onboarding-container>
</main>

<svelte:window onkeypress={handleKeyPress} />

<style lang="scss">
main {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

onboarding-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;

    h1 {
        color: white;
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
    }

    p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
        font-size: 1.1rem;
    }
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