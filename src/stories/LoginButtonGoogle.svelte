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
import ButtonRaised from "$/stories/ButtonRaised.svelte";
import {SocialLogin} from "@capgo/capacitor-social-login";
import {PUBLIC_GOOGLE_CLIENT_ID} from "$env/static/public";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import googleLogo from "$/public/google.svg";

const {
    supabase,
    onLogin,
}: {
    supabase: SupabaseClient,
    onLogin: (user: User, accessToken: string) => void,
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
    if (data.error !== null) return;

    const userResponse = await supabase.auth.getUser();
    if (userResponse.error !== null) return;

    onLogin(userResponse.data.user, data.data.session.access_token);
};
</script>

<ButtonRaised
    label="Login with Google"
    onClick={() => login()}
>
    <img src={googleLogo} />
</ButtonRaised>
