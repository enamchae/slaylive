<script lang="ts">
import type { SupabaseClient, User } from "@supabase/supabase-js";

import LoginButtonGoogle from "./LoginButtonGoogle.svelte";

const {
    supabase,
    onLogin,
}: {
    supabase: SupabaseClient,
    onLogin: (user: User, accessToken: string) => void,
} = $props();
</script>

<login-cta>
    <div>Sign in and start shopping</div>

    <button-rack>
        <LoginButtonGoogle
            {supabase}
            {onLogin}
        />
    </button-rack>
</login-cta>

<style lang="scss">
login-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0 2.5rem 0;

    background: linear-gradient(#fff calc(100% - 2rem), #0000);
}
</style>