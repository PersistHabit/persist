import { ExceptionHandler, type HttpContext } from "@adonisjs/core/http";
import { errors } from "@adonisjs/limiter";

export default class HttpExceptionHandler extends ExceptionHandler {
	async handle(error: unknown, ctx: HttpContext) {
		if (error instanceof errors.E_TOO_MANY_REQUESTS) {
			const message = error.getResponseMessage(ctx);
			const headers = error.getDefaultHeaders();

			// headers "Retry-After", "X-RateLimit-*" etc.
			for (const [key, value] of Object.entries(headers)) {
				ctx.response.header(key, value as string);
			}

			if (ctx.request.header("x-inertia")) {
				ctx.session.flashErrors({
					E_TOO_MANY_REQUESTS: message,
				});
				return ctx.response.redirect().back();
			}

			// JSON (API)
			if (ctx.request.accepts(["json"])) {
				return ctx.response.status(error.status).send({ message });
			}

			// HTML (page classique)
			return ctx.response.status(error.status).send(message);
		}

		return super.handle(error, ctx);
	}
}
