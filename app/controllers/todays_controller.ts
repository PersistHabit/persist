import cache from "@adonisjs/cache/services/main";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import AgendaItemCompletion from "#models/agenda_item_completion";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { AgendaService } from "#services/agenda_service";

@inject()
export default class TodaysController {
	constructor(protected agendaService: AgendaService) {}

	async index({ auth, inertia }: HttpContext) {
		const { id } = auth.getUserOrFail();
		const items = await cache.getOrSet({
			key: `today:events:${id}`,
			ttl: "5m",
			tags: [`user:${id}`, "today:events"],
			factory: async () => {
				const eventList = await this.agendaService.listTodayItems(id);
				return eventList;
			},
		});
		return inertia.render("today", { items });
	}

	async storeCompletion({ auth, params, request, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { itemId } = params;

		const item = await AgendaItem.query()
			.where("id", itemId)
			.where("user_id", userId)
			.firstOrFail();

		const occurrenceDate = DateTime.fromISO(request.input("occurrence_date"));

		await AgendaItemCompletion.firstOrCreate(
			{ agendaItemId: item.id, occurrenceDate },
			{ completedAt: DateTime.now() },
		);

		await cache.delete({ key: `today:events:${userId}` });
		return response.redirect().back();
	}

	async destroyCompletion({ auth, params, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { itemId, completionId } = params;

		const item = await AgendaItem.query()
			.where("id", itemId)
			.where("user_id", userId)
			.firstOrFail();

		await AgendaItemCompletion.query()
			.where("id", completionId)
			.where("agenda_item_id", item.id)
			.delete();

		await cache.delete({ key: `today:events:${userId}` });
		return response.redirect().back();
	}
}
