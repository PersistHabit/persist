import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { StatsService } from "#services/stats_service";

@inject()
export default class StatsController {
	constructor(protected statsService: StatsService) {}

	async index({ auth, inertia }: HttpContext) {
		const { id } = auth.getUserOrFail();
		const stats = await this.statsService.getStats(id);

		return inertia.render("stats", { stats });
	}
}
