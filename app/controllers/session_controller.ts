import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { SessionService } from "#services/session_service";
import { loginValidator, registerValidator } from "#validators/session";

@inject()
export default class SessionController {
	constructor(protected sessionService: SessionService) {}

	async login(ctx: HttpContext) {
		const payload = await ctx.request.validateUsing(loginValidator);
		await this.sessionService.authenticate(ctx, payload);
		return ctx.response.redirect("/");
	}

	async register({ request, response }: HttpContext) {
		const payload = await request.validateUsing(registerValidator);
		await this.sessionService.register(payload);
		return response.redirect().toPath("/login");
	}

	async logout(ctx: HttpContext) {
		await this.sessionService.logout(ctx);
		return ctx.response.redirect("/");
	}
}
