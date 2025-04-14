import adapterStatic from "@sveltejs/adapter-static";
import adapterNode from "@sveltejs/adapter-node";
import adapterVercel from "@sveltejs/adapter-vercel";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const adapter = () => {
	switch (process.env.BUILD_TYPE) {
		case "static": 
			return adapterStatic({
				strict: false, // ignore api routes
				pages: "./build/static",
			});
		
		default:
		case "node":
			return adapterNode({
				out: "./build/node",
			});
		
		case "vercel":
			return adapterVercel({
				runtime: "nodejs20.x",
			});
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			"$": "./src",
			"$stories": "./src/stories",
			"$api": "./src/routes/api",
			"$routes": "./src/routes",
		},

		csrf: {
			checkOrigin: false,
		},
	},
};

export default config;
