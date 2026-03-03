import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { CounterService } from "#services/counter_service";
import { counterValidator } from "#validators/counter";

@inject()
export default class CountersController {
	constructor(protected counterService: CounterService) {}

	async index({ inertia, auth }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		await this.counterService.applyDailyTicks(userId);
		const counters = await this.counterService.index(userId);
		return inertia.render("counters", {
			counters,
		});
	}

	async store({ request, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const payload = await request.validateUsing(counterValidator);
		await this.counterService.createCounter(payload, userId);
		return response.redirect().back();
	}

	async increment({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { counterId } = params;

		await this.counterService.increment(userId, counterId);
		return response.redirect().back();
	}
	async decrement({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { counterId } = params;

		await this.counterService.decrement(userId, counterId);
		return response.redirect().back();
	}

	async reset({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { counterId } = params;
		await this.counterService.resetCounter(userId, counterId);
		return response.redirect().back();
	}

	async update({ params, request, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { counterId } = params;
		const payload = await request.validateUsing(counterValidator);
		await this.counterService.updateCounter(userId, counterId, payload);
		return response.redirect().back();
	}

	async destroy({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { counterId } = params;
		await this.counterService.deleteCounter(userId, counterId);
		return response.redirect().back();
	}
}
