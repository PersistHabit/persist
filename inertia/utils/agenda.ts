import type { AgendaItemOccurrence, NewEventFormData } from "#types/agenda";

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

export function toFormInitialData(
	ev: AgendaItemOccurrence,
): Partial<NewEventFormData> {
	return {
		title: ev.title,
		dayMoment: ev.dayMoment,
		category: ev.category,
		startDate: ev.startDate.toISOString().slice(0, 10),
		endDate: toDateInputValue(ev.endDate),
		recurrence: {
			type: ev.recurrence.type,
			unit: ev.recurrence.unit,
			interval: ev.recurrence.interval,
			days: ev.recurrence.days ?? [],
		},
	};
}
