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
    padding: 2rem;
}
</style>