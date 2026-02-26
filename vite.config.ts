import inertia from "@adonisjs/inertia/vite";
import adonisjs from "@adonisjs/vite/client";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		inertia({ ssr: { enabled: false } }),
		react(),
		adonisjs({
			entrypoints: ["inertia/app.tsx"],
			reload: ["resources/views/**/*.edge"],
		}),
		tailwindcss(),
	],

	build: {
		chunkSizeWarningLimit: 700,
	},

	/**
	 * Define aliases for importing modules from
	 * your frontend code
	 */
	resolve: {
		alias: {
			"@/": `${import.meta.dirname}/inertia/`,
			"#tuyau": `${import.meta.dirname}/.adonisjs/client/registry/index.ts`,
		},
	},
});
