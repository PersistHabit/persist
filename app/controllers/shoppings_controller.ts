import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { ShoppingService } from "#services/shopping_service";
import { shoppingValidator } from "#validators/shopping";

@inject()
export default class ShoppingsController {
	constructor(protected shoppingService: ShoppingService) {}

	async index({ inertia, auth }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const shoppingItems = await this.shoppingService.listItems(userId);
		return inertia.render("shopping", { shoppingItems });
	}

	async store({ request, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const payload = await request.validateUsing(shoppingValidator);
		await this.shoppingService.create(userId, payload);
		return response.redirect().back();
	}

	async markAsDone({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { shoppingItemId } = params;
		await this.shoppingService.markAsDone(userId, shoppingItemId);
		return response.redirect().back();
	}

	async markAsUndone({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { shoppingItemId } = params;
		await this.shoppingService.markAsUndone(userId, shoppingItemId);
		return response.redirect().back();
	}

	async pin({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { shoppingItemId } = params;
		await this.shoppingService.pin(userId, shoppingItemId);
		return response.redirect().back();
	}

	async unPin({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { shoppingItemId } = params;
		await this.shoppingService.unPin(userId, shoppingItemId);
		return response.redirect().back();
	}

	async update({ params, request, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { shoppingItemId } = params;
		const payload = await request.validateUsing(shoppingValidator);
		await this.shoppingService.update(userId, shoppingItemId, payload);
		return response.redirect().back();
	}

	async destroy({ params, auth, response }: HttpContext) {
		const { id: userId } = auth.getUserOrFail();
		const { shoppingItemId } = params;
		await this.shoppingService.delete(userId, shoppingItemId);
		return response.redirect().back();
	}
}
