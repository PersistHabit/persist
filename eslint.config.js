import { configApp } from "@adonisjs/eslint-config";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default [
	{ ignores: ["database/schema.ts"] },
	...configApp(),
	{
		rules: {
			"prettier/prettier": "off",
		},
	},

	{
		files: ["inertia/**/*.{js,jsx,ts,tsx}"],
		plugins: { react, hooks },
		settings: { react: { version: "detect" } },
		rules: {
			"react/no-unknown-property": "error",
			"react/jsx-key": "error",
			"hooks/rules-of-hooks": "error",
			"hooks/exhaustive-deps": "warn",
			"react/react-in-jsx-scope": "off",
			"@adonisjs/no-backend-import-in-frontend": [
				"error",
				{
					allowed: [
						"#types/agenda",
						"#types/journal",
						"#types/counter",
						"#types/shopping",
						"#tuyau",
						"../../package.json",
					],
				},
			],
		},
	},
];
