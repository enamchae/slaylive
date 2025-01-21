<script lang="ts">
import { goto } from "$app/navigation";

import { store } from "../store.svelte";
import {PUBLIC_API_URL} from "$env/static/public";

let joinCallId = $state("");

const register = async () => {
    const response = await (await globalThis.fetch(new URL("/api/user/create", PUBLIC_API_URL).href, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
    })).json();

    store.userId = response.userId;
    store.userName = response.userName;
};

const login = async () => {
    const response = await (await globalThis.fetch(new URL("/api/user/login", PUBLIC_API_URL).href, {
        method: "post",
        body: JSON.stringify({
            userId: store.userId,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })).json();

    store.userToken = response.userToken;
};
</script>


<button onclick={register}>
    Create a user
</button>

<button
    onclick={login}
    disabled={store.userId === null}
>
    Login
</button>

<button
    onclick={() => goto("/backstage")}
    disabled={store.userId === null || store.userToken === null}
>
    Start a call
</button>

<button
    onclick={() => goto(`/watch?call_id=${encodeURIComponent(joinCallId)}`)}
    disabled={store.userId === null || store.userToken === null}
>
    Join call
</button>

<input
    type="text"
    bind:value={joinCallId}
/>

<div>
    User id: {store.userId}
</div>
<div>
    User token: {store.userToken}
</div>
<div>
    User name: {store.userName}
</div>