import { defineConfig, drivers } from "@adonisjs/core/hash";

const hashConfig = defineConfig({
	default: "argon",

	list: {
		argon: drivers.argon2({
			version: 0x13,
			variant: "id",
			iterations: 4,
			memory: 131072,
			parallelism: 2,
			saltSize: 16,
			hashLength: 32,
		}),
	},
});

export default hashConfig;

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module "@adonisjs/core/types" {
	export interface HashersList extends InferHashers<typeof hashConfig> {}
}
