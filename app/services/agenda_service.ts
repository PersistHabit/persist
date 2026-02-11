import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import type { EventPayload } from "#types/agenda";
import { daysToNumberMap } from "../helpers/agenda.js";

export class AgendaService {
	async listEvents(userId: number) {
		const start = DateTime.now().startOf("day");
		const end = start.plus({ days: 14 }).endOf("day");

		return await AgendaItem.query()
			.where("user_id", userId)
			.where("is_active", true)
			.andWhere((q) => {
				// 1) Ponctuels : start_date dans la fenêtre
				q.where((qq) => {
					qq.where("recurrence_type", "once") // <-- adapte à ton slug "ponctuel"
						.whereBetween("start_date", [start.toSQL(), end.toSQL()]);
				});

				// 2) Récurrents : start_date <= end
				q.orWhere((qq) => {
					qq.whereNot("recurrence_type", "once") // <-- adapte
						.where("start_date", "<=", end.toSQL());
				});
			})
			.orderBy("start_date", "asc");
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
			recurrenceType: payload.recurrence.type,
			recurrenceUnit: payload.recurrence.unit,
			recurrenceInterval: payload.recurrence.interval,
			weekDays: daysMap,
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
			recurrenceType: payload.recurrence.type,
			recurrenceUnit: payload.recurrence.unit,
			recurrenceInterval: payload.recurrence.interval,
			weekDays: daysMap,
		});

		await event.save();
	}

	async deleteEvent(userId: number, eventId: number) {
		const event = await AgendaItem.query()
			.where("user_id", userId)
			.andWhere("id", eventId)
			.firstOrFail();
		await event.delete();
	}
}
