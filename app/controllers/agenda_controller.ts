import cache from "@adonisjs/cache/services/main";
import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { AgendaService } from "#services/agenda_service";
import { agendaEventValidator } from "#validators/agenda";

@inject()
export default class AgendaController {
	constructor(protected agendaService: AgendaService) {}

	async index({ auth, inertia }: HttpContext) {
		const { id } = auth.getUserOrFail();

		const events = await cache.getOrSet({
			key: `agenda:events:${id}`,
			ttl: "5m",
			tags: [`user:${id}`, "agenda:events"],
			factory: async () => {
				const eventList = await this.agendaService.listEvents(id);
				return eventList;
			},
		});

		return inertia.render("agenda", {
			events,
		});
	}

	async store({ auth, request, response }: HttpContext) {
		const { id } = auth.getUserOrFail();
		const payload = await request.validateUsing(agendaEventValidator);
		await this.agendaService.createNewEvent(payload, id);
		await cache.delete({ key: `agenda:events:${id}` });
		return response.redirect().back();
	}

	async update({ params, auth, request, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { eventId } = params;
		const payload = await request.validateUsing(agendaEventValidator);
		await this.agendaService.updateEvent(payload, userId, eventId);
		await cache.delete({ key: `agenda:events:${userId}` });
		return response.redirect().back();
	}

	async destroy({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { eventId } = params;
		await this.agendaService.deleteEvent(userId, eventId);
		await cache.delete({ key: `agenda:events:${userId}` });
		return response.redirect().back();
	}
}
