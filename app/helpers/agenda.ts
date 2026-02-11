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
