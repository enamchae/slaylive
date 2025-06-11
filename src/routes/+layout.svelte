<script lang="ts">
import {store} from "./store.svelte";
import "$stories/index.scss";

let { children, data } = $props();

store.buildType.resolve(data.BUILD_TYPE);
</script>

<content-container>
	{@render children()}
</content-container>

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
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Shanti&display=swap"
	/>
</svelte:head>

<style lang="scss">
content-container {
	display: flex;
	flex-direction: column;
	align-items: stretch;
    width: 100vw;
    height: 100vh;

	background: linear-gradient(#664334, #712F3F);
	color: #fff;
	font-size: 1.25rem;

	> main {
		flex-grow: 1;
	}
}
</style>