export type ThemeMode = "light" | "dark" | "system";

const KEY = "theme";

export function getThemeMode(): ThemeMode {
	const v = localStorage.getItem(KEY);
	return v === "light" || v === "dark" || v === "system" ? v : "system";
}

export function setThemeMode(mode: ThemeMode) {
	localStorage.setItem(KEY, mode);
	applyThemeMode(mode);
}

export function applyThemeMode(mode: ThemeMode) {
	const prefersDark =
		window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
	const isDark = mode === "dark" || (mode === "system" && prefersDark);

	document.documentElement.classList.toggle("dark", isDark);
}
