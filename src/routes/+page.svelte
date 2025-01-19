<script lang="ts">
import Button from "$stories/Button.svelte";
import { onMount } from "svelte";
import {SocialLogin} from "@capgo/capacitor-social-login";
import { goto } from "$app/navigation";
import {PUBLIC_GOOGLE_CLIENT_ID} from "$env/static/public";
    import { store } from "./store.svelte";

// const {data} = $props();
// const {supabase} = $derived(data);

onMount(() => {
    SocialLogin.initialize({
        google: {
            webClientId: PUBLIC_GOOGLE_CLIENT_ID,
        },
    });
});

const login = async () => {
    const response = await SocialLogin.login({
        provider: "google",
        options: {},
    });
    
    store.accessToken = response.result.accessToken;

    goto("/control");
};
</script>

<div>
    <!-- <Button
        label="Login with Google"
        onClick={() => supabase.auth.signInWithOAuth({provider: "google"})}
    /> -->
    <Button
        label="Login with Google"
        onClick={() => login()}
    />
</div>