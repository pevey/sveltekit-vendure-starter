import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { cjsInterop } from 'vite-plugin-cjs-interop'

export default defineConfig({
	plugins: [
		sveltekit(),
		cjsInterop({
			dependencies: [
				 "@googlemaps/js-api-loader",
			],
	  }),
	],
	// server: {
	//    host: 'localhost',
	//    port: 5173
	// },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		exclude: ['@urql/svelte'],
	}
})
