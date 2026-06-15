import type { DateTime } from "luxon";
import {
	NumberToWeekdayMap,
	type WeekdaySlug,
	WeekdaysMap,
} from "#types/agenda";

export function daysToNumberMap(days: WeekdaySlug[]) {
	return days.map((day) => WeekdaysMap[day]);
}

export function numberToDaysMap(days: number[]) {
	return days.map((day) => NumberToWeekdayMap[day]);
}

type RecurringItem = {
	startDate: DateTime;
	endDate: DateTime | null;
	recurrenceType: string;
	recurrenceInterval: number | null;
	weekDays: number[] | null;
};

/**
 * Indique si une tâche récurrente a une occurrence prévue à la date donnée.
 * Logique partagée entre l'écran "Aujourd'hui" et les statistiques.
 */
export function isItemDueOn(item: RecurringItem, date: DateTime): boolean {
	const start = item.startDate.startOf("day");
	const day = date.startOf("day");

	if (day < start) return false;
	if (item.endDate && day > item.endDate.startOf("day")) return false;

	const weekday = day.toJSDate().getDay();
	const startWeekday = start.toJSDate().getDay();

	switch (item.recurrenceType) {
		case "once":
			return start.toFormat("yyyy-MM-dd") === day.toFormat("yyyy-MM-dd");

		case "daily":
			return true;

		case "weekly": {
			const allowed = item.weekDays?.length ? item.weekDays : [startWeekday];
			return allowed.includes(weekday);
		}

		case "monthly":
			return start.day === day.day;

		case "custom": {
			const interval = item.recurrenceInterval ?? 1;
			const weeksDiff = Math.floor(
				day.startOf("week").diff(start.startOf("week"), "weeks").weeks,
			);
			if (weeksDiff < 0 || weeksDiff % interval !== 0) return false;
			const allowed = item.weekDays?.length ? item.weekDays : [startWeekday];
			return allowed.includes(weekday);
		}

		default:
			return false;
	}
}
