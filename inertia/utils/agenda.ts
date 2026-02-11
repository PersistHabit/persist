export function toDateInputValue(value: unknown): string {
	if (!value) return "";

	// Déjà au bon format
	if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
		return value;

	// String ISO / autre
	const d = value instanceof Date ? value : new Date(String(value));
	if (Number.isNaN(d.getTime())) return "";

	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}
