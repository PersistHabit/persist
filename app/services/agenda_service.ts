import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import AgendaItemPause from "#models/agenda_item_pause";
import type { EventPayload } from "#types/agenda";
import { daysToNumberMap } from "../helpers/agenda.js";

export class AgendaService {
	async listEvents(userId: number) {
		const start = DateTime.now().startOf("day");
		const today = start.toFormat("yyyy-MM-dd");
		const windowEnd = start.plus({ days: 31 }).toFormat("yyyy-MM-dd");

		const items = await AgendaItem.query()
			.where("user_id", userId)
			.where("is_active", true)
			.preload("pauses", (q) => {
				q.where("started_at", "<=", today).andWhere((sub) => {
					sub.whereNull("ended_at").orWhere("ended_at", ">=", today);
				});
			})
			.andWhere((q) => {
				q.whereNull("end_date").orWhere("end_date", ">=", today);
			})
			.andWhere((q) => {
				// 1) Ponctuels à venir (sans borne supérieure)
				q.where((qq) => {
					qq.where("recurrence_type", "once").where("start_date", ">=", today);
				});

				// 2) Récurrents : start_date <= fin de la fenêtre (31 jours)
				q.orWhere((qq) => {
					qq.whereNot("recurrence_type", "once").where(
						"start_date",
						"<=",
						windowEnd,
					);
				});
			})
			.orderBy("start_date", "asc");

		return items.map((item) => {
			const pause = item.pauses[0] ?? null;
			const { ...serialized } = item.serialize();
			return {
				...serialized,
				isPaused: pause !== null,
				activePause: pause
					? {
							id: pause.id,
							startedAt: pause.startedAt.toFormat("yyyy-MM-dd"),
							endedAt: pause.endedAt?.toFormat("yyyy-MM-dd") ?? null,
						}
					: null,
			};
		});
	}

	async createNewEvent(payload: EventPayload, userId: number) {
		const daysMap =
			payload.recurrence.days && payload.recurrence.days.length > 0
				? daysToNumberMap(payload.recurrence.days)
				: null;

		const dt = DateTime.fromJSDate(payload.startDate);

		await AgendaItem.create({
			userId,
			title: payload.title,
			dayMoment: payload.dayMoment,
			category: payload.category,
			startDate: dt,
			endDate: payload.endDate ? DateTime.fromJSDate(payload.endDate) : null,
			recurrenceType: payload.recurrence.type,
			recurrenceUnit: payload.recurrence.unit,
			recurrenceInterval: payload.recurrence.interval,
			weekDays: daysMap,
			startHour: payload.startHour ?? null,
		});
	}

	async updateEvent(payload: EventPayload, userId: number, eventId: number) {
		const event = await AgendaItem.query()
			.where("user_id", userId)
			.andWhere("id", eventId)
			.firstOrFail();

		const daysMap =
			payload.recurrence.days && payload.recurrence.days.length > 0
				? daysToNumberMap(payload.recurrence.days)
				: null;

		const dt = DateTime.fromJSDate(payload.startDate);

		event.merge({
			title: payload.title,
			dayMoment: payload.dayMoment,
			category: payload.category,
			startDate: dt,
			endDate: payload.endDate ? DateTime.fromJSDate(payload.endDate) : null,
			recurrenceType: payload.recurrence.type,
			recurrenceUnit: payload.recurrence.unit,
			recurrenceInterval: payload.recurrence.interval,
			weekDays: daysMap,
			startHour: payload.startHour ?? null,
		});

		await event.save();
	}

	async listTodayItems(userId: number) {
		const today = DateTime.now().startOf("day");
		const todayStr = today.toFormat("yyyy-MM-dd");

		const items = await AgendaItem.query()
			.where("user_id", userId)
			.where("is_active", true)
			.where("start_date", "<=", todayStr)
			.andWhere((q) => {
				q.whereNull("end_date").orWhere("end_date", ">=", todayStr);
			})
			.preload("pauses", (q) => {
				q.where("started_at", "<=", todayStr).andWhere((sub) => {
					sub.whereNull("ended_at").orWhere("ended_at", ">=", todayStr);
				});
			})
			.preload("completions", (q) => {
				q.where("occurrence_date", todayStr);
			});

		const todayWeekday = today.toJSDate().getDay();

		const todayItems = items.filter((item) => {
			const start = item.startDate;

			switch (item.recurrenceType) {
				case "once":
					return start.toFormat("yyyy-MM-dd") === todayStr;

				case "daily":
					return true;

				case "weekly": {
					const allowed = item.weekDays?.length
						? item.weekDays
						: [start.toJSDate().getDay()];
					return allowed.includes(todayWeekday);
				}

				case "monthly":
					return start.day === today.day;

				case "custom": {
					const interval = item.recurrenceInterval ?? 1;
					const startMonday = start.startOf("week");
					const todayMonday = today.startOf("week");
					const weeksDiff = Math.floor(
						todayMonday.diff(startMonday, "weeks").weeks,
					);
					if (weeksDiff < 0 || weeksDiff % interval !== 0) return false;
					const allowed = item.weekDays?.length
						? item.weekDays
						: [start.toJSDate().getDay()];
					return allowed.includes(todayWeekday);
				}

				default:
					return false;
			}
		});

		todayItems.sort((a, b) => {
			if (a.startHour && b.startHour) return a.startHour - b.startHour;
			if (a.startHour) return -1;
			if (b.startHour) return 1;
			return 0;
		});

		return todayItems.map((item) => {
			const pause = item.pauses[0] ?? null;
			const completion = item.completions[0] ?? null;
			const { ...serialized } = item.serialize();
			return {
				...serialized,
				title: item.title,
				isPaused: pause !== null,
				activePause: pause
					? {
							id: pause.id,
							startedAt: pause.startedAt.toFormat("yyyy-MM-dd"),
							endedAt: pause.endedAt?.toFormat("yyyy-MM-dd") ?? null,
						}
					: null,
				isCompleted: completion !== null,
				completionId: completion?.id ?? null,
			};
		});
	}

	async deleteEvent(userId: number, eventId: number) {
		const event = await AgendaItem.query()
			.where("user_id", userId)
			.andWhere("id", eventId)
			.firstOrFail();
		await event.delete();
	}

	async stopPause(userId: number, eventId: number, pauseId: number) {
		const event = await AgendaItem.query()
			.where("user_id", userId)
			.andWhere("id", eventId)
			.firstOrFail();

		await AgendaItemPause.query()
			.where("id", pauseId)
			.andWhere("agenda_item_id", event.id)
			.delete();
	}

	async pauseEvent(
		userId: number,
		eventId: number,
		startedAt: DateTime,
		endedAt: DateTime | null,
	) {
		const event = await AgendaItem.query()
			.where("user_id", userId)
			.andWhere("id", eventId)
			.firstOrFail();

		await AgendaItemPause.create({
			agendaItemId: event.id,
			startedAt,
			endedAt,
		});
	}
}
