<script lang="ts" module>
import {SocialLogin} from "@capgo/capacitor-social-login";
import {PUBLIC_GOOGLE_CLIENT_ID} from "$env/static/public";

(async () => {
    // if (await store.buildType === "static") {
    SocialLogin.initialize({
        google: {
            webClientId: PUBLIC_GOOGLE_CLIENT_ID,
        },
    });
    // }
})();
</script>

<script lang="ts">
import ButtonRaised from "$/stories/ButtonRaised.svelte";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import googleLogo from "$/public/google.svg";
import { store } from "$/routes/store.svelte";

const {
    supabase,
    onLogin,
}: {
    supabase: SupabaseClient,
    onLogin: (user: User, accessToken: string) => void,
} = $props();

const supabaseSignin = async () => {
    // switch (await store.buildType) {
    //     case "static": {
    const response = await SocialLogin.login({
        provider: "google",
        options: {},
    });

    return await supabase.auth.signInWithIdToken({
        provider: "google",
        token: response.result.idToken,
    });
    //     }

    //     default:
    //         return await supabase.auth.signInWithOAuth({
    //             provider: "google",
    //             options: {
    //                 skipBrowserRedirect: true,
    //             },
    //         });
    // }
};

const login = async () => {
    const data = await supabaseSignin();
    if (data.error !== null) return;

    const userResponse = await supabase.auth.getUser();
    if (userResponse.error !== null) return;

    const sessionResponse = await supabase.auth.getSession();
    if (sessionResponse.error !== null || sessionResponse.data.session === null) return;

    onLogin(userResponse.data.user, sessionResponse.data.session.access_token);
};
</script>

<ButtonRaised
    onClick={() => login()}
>
    <img src={googleLogo} />
</ButtonRaised>
