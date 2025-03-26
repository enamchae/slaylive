<script lang="ts">
import { i18n } from '$lib/i18n';
import { ParaglideJS } from '@inlang/paraglide-sveltekit';
import "$stories/index.scss";

let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<content-container>
		{@render children()}
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

	background: linear-gradient(#A47764, #D19C97);
	color: #fff;
	font-size: 1.25rem;

	> main {
		flex-grow: 1;
	}
}
</style>