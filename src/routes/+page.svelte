<script lang="ts">
import { goto } from "$app/navigation";
import {type User} from "@supabase/supabase-js";

import { store } from "./store.svelte";
import LoginButton from "$stories/LoginButton.svelte";
import {fetchApi} from "$routes/util";

const {data} = $props();
const {supabase} = $derived(data);


let joinCallId = $state("");

const updateLoginState = async (user: User) => {
    const response = await fetchApi("user/login", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
    });

    store.user = {
        supabaseUser: user,
        streamioAuth: {
            id: response.userId,
            name: response.userName,
            token: response.userToken,
        },
    };
};
</script>

<LoginButton
    {supabase}
    onLogin={updateLoginState}
/>

<button
    onclick={() => goto("/backstage")}
    disabled={store.user === null}
>
    Start a call
</button>

<button
    onclick={() => goto(`/watch?call_id=${encodeURIComponent(joinCallId)}`)}
    disabled={store.user === null}
>
    Join call
</button>

<input
    type="text"
    bind:value={joinCallId}
/>