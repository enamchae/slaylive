<script lang="ts">
import { onMount } from "svelte";
import { goto } from "$app/navigation";
import {type User} from "@supabase/supabase-js";

import LoginButtonGoogle from "@/LoginButtonGoogle.svelte";
import { store } from "./store.svelte";
import { api } from "$api/client";

let { data } = $props();

const {supabase} = $derived(data);


onMount(() => {
    if (store.user === null) return;

    if (store.user.finishedProfileSetup) {
        goto("/now-live");
    } else {
        goto("/onboarding/name");
    }
});

const updateLoginState = async (user: User, accessToken: string) => {
    const response = await api.user.login({}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    
    store.user = {
        supabaseUser: user,
        supabaseAccessToken: accessToken,
        streamioAuth: {
            id: response.userId,
            name: response.userName,
            token: response.streamioUserToken,
        },
		id: response.userId,
		name: response.userName,
        canSell: response.canSell,
        finishedProfileSetup: response.finishedProfileSetup,
    };

    if (response.finishedProfileSetup) {
        goto("/now-live");
    } else {
        goto("/onboarding/name");
    }
};
</script>


<main>
    <h1>SLAY - demo</h1>

    <button-rack>
        <LoginButtonGoogle
            {supabase}
            onLogin={updateLoginState}
        />
    </button-rack>
</main>

<style lang="scss">
main {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem 0 2.5rem 0;
}
</style>