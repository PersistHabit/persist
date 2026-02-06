/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { applyThemeMode, getThemeMode } from "@/utils/theme";
import "../css/app.css";
import "../css/global.css";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

const mode = getThemeMode();
applyThemeMode(mode);

if (mode === "system") {
	// suivre les changements système
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => applyThemeMode("system"));
}

const appName = import.meta.env.VITE_APP_NAME || "Persist";

createInertiaApp({
	progress: { color: "#46B9AA" },

	title: (title) => `${title} - ${appName}`,

	resolve: (name) => {
		return resolvePageComponent(
			`../pages/${name}.tsx`,
			import.meta.glob("../pages/**/*.tsx"),
		);
	},

	setup({ el, App, props }) {
		createRoot(el).render(<App {...props} />);
	},
});
