<script lang="ts" module>
import { browser } from "$app/environment";

if (browser) {
    SocialLogin.initialize({
        google: {
            webClientId: PUBLIC_GOOGLE_CLIENT_ID,
        },
    });
}
</script>

<script lang="ts">
import Button from "$stories/Button.svelte";
import {SocialLogin} from "@capgo/capacitor-social-login";
import {PUBLIC_GOOGLE_CLIENT_ID} from "$env/static/public";
import type { SupabaseClient, User } from "@supabase/supabase-js";

const {
    supabase,
    onLogin,
}: {
    supabase: SupabaseClient,
    onLogin: (user: User) => void,
} = $props();

const login = async () => {
    const response = await SocialLogin.login({
        provider: "google",
        options: {},
    });

    const data = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.result.idToken,
    });

    const userResponse = await supabase.auth.getUser();

    if (userResponse.error !== null) return;

    onLogin(userResponse.data.user);
};
</script>

<Button
    label="Login with Google"
    onClick={() => login()}
/>