import { configApp } from "@adonisjs/eslint-config";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default [
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
		},
	},
];
