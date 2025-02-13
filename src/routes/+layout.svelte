<script lang="ts">
import { i18n } from '$lib/i18n';
import { ParaglideJS } from '@inlang/paraglide-sveltekit';
import Tabs from "$stories/Tabs.svelte";
import { goto } from "$app/navigation";
import {type User} from "@supabase/supabase-js";

import { store } from "./store.svelte";
import {apiFetch} from "$routes/util";
import LoginCta from "$/stories/LoginCta.svelte";

import "$stories/index.scss";

let { children, data } = $props();

const {supabase} = $derived(data);


const updateLoginState = async (user: User, accessToken: string) => {
    const response = await apiFetch("user/login", {
        method: "POST",
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
            token: response.userToken,
        },
        canSell: response.canSell,
    };
};
</script>

<ParaglideJS {i18n}>
	<content-container>
		{#if store.user === null}
			<LoginCta
				{supabase}
				onLogin={updateLoginState}
			/>
		{/if}

		<main>
			{@render children()}
		</main>
		
		<Tabs />
	</content-container>
</ParaglideJS>

<svelte:head>
	<link
		rel="preconnect"
		href="https://fonts.googleapis.com"
	/>
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin=""
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<style lang="scss">
content-container {
	display: flex;
	flex-direction: column;
	align-items: stretch;
    width: 100vw;
    height: 100vh;

	background: linear-gradient(#e2fae6, rgb(251, 253, 225));

	> main {
		flex-grow: 1;
	}
}
</style>