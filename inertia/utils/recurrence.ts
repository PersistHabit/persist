import type { AgendaItem, AgendaItemOccurrence } from "#types/agenda";
import { NumberToWeekdayMap } from "#types/agenda";

type Occurrence = {
	key: string;
	date: Date;
	event: AgendaItemOccurrence;
};

type DayBucket = {
	date: Date;
	events: Occurrence[];
};

export function formatRecurrence(ev: AgendaItemOccurrence) {
	switch (ev.recurrence.type) {
		case "once":
			return "Une fois";

		case "daily":
			return "Chaque jour";

		case "weekly":
			return "Chaque semaine";

		case "monthly":
			return "Chaque mois";

		case "custom":
			if (ev.recurrence.interval && ev.recurrence.unit) {
				return `Tous les ${ev.recurrence.interval} ${ev.recurrence.unit}s`;
			}
			return "Personnalisé";

		default:
			return "";
	}
}

const MS_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(d: Date) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
	return new Date(d.getTime() + n * MS_DAY);
}

function dateKey(d: Date) {
	const dd = startOfDay(d);
	const y = dd.getFullYear();
	const m = String(dd.getMonth() + 1).padStart(2, "0");
	const day = String(dd.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function parseDateOnly(value: string) {
	const [y, m, d] = value.split("-").map(Number);
	return new Date(y, m - 1, d);
}

export function normalizeEvents(events: AgendaItem[]) {
	return events.map((e) => ({
		...e,
		startDate:
			typeof e.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.startDate)
				? parseDateOnly(e.startDate)
				: new Date(e.startDate),
	}));
}

function mondayOf(d: Date) {
	const sd = startOfDay(d);
	const js = sd.getDay();
	const delta = (js + 6) % 7;
	return addDays(sd, -delta);
}

function occursOnDate(ev: AgendaItem, date: Date) {
	const day = startOfDay(date);
	const start = startOfDay(ev.startDate);

	if (day.getTime() < start.getTime()) return false;

	if (ev.endDate) {
		const end = parseDateOnly(ev.endDate);
		if (day.getTime() > end.getTime()) return false;
	}

	switch (ev.recurrenceType) {
		case "once":
			return dateKey(day) === dateKey(start);

		case "daily":
			return true;

		case "weekly": {
			const allowed = ev.weekDays?.length ? ev.weekDays : [start.getDay()];
			return allowed.includes(day.getDay());
		}

		case "monthly":
			return day.getDate() === start.getDate();

		case "custom": {
			const interval = ev.recurrenceInterval ?? 1;

			const anchor = mondayOf(start);
			const current = mondayOf(day);

			const weeksDiff = Math.floor(
				(current.getTime() - anchor.getTime()) / (7 * MS_DAY),
			);

			if (weeksDiff < 0 || weeksDiff % interval !== 0) return false;

			const allowed = ev.weekDays?.length ? ev.weekDays : [start.getDay()];
			return allowed.includes(day.getDay());
		}

		default:
			return false;
	}
}

const dayMomentOrder: Record<AgendaItem["dayMoment"], number> = {
	morning: 0,
	afternoon: 1,
	evening: 2,
};

export function build14Days(
	events: AgendaItem[],
	from = new Date(),
): DayBucket[] {
	const start = startOfDay(from);

	const buckets: DayBucket[] = Array.from({ length: 15 }, (_, i) => ({
		date: addDays(start, i),
		events: [],
	}));

	for (const ev of events) {
		for (const bucket of buckets) {
			if (occursOnDate(ev, bucket.date)) {
				bucket.events.push({
					key: `${dateKey(bucket.date)}-${ev.id}`,
					date: bucket.date,
					event: {
						id: ev.id,
						title: ev.title,
						dayMoment: ev.dayMoment,
						category: ev.category,
						startDate: ev.startDate,
						endDate: ev.endDate,
						isPaused: ev.isPaused,
						activePause: ev.activePause,
						recurrence: {
							type: ev.recurrenceType,
							unit: ev.recurrenceUnit ? ev.recurrenceUnit : undefined,
							interval: ev.recurrenceInterval
								? ev.recurrenceInterval
								: undefined,
							days: ev.weekDays
								? ev.weekDays.map((d) => NumberToWeekdayMap[d])
								: [],
						},
					},
				});
			}
		}
	}

	for (const bucket of buckets) {
		bucket.events.sort(
			(a, b) =>
				dayMomentOrder[a.event.dayMoment] - dayMomentOrder[b.event.dayMoment],
		);
	}

	return buckets.filter((b) => b.events.length > 0);
}
