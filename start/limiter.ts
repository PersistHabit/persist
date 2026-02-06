/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import type { HttpContext } from "@adonisjs/core/http";
import limiter from "@adonisjs/limiter/services/main";

export const throttle = limiter.define("global", () => {
	return limiter.allowRequests(10).every("1 minute");
});

export const authGuestThrottle = limiter.define(
	"auth_guest",
	(ctx: HttpContext) => {
		return limiter
			.allowRequests(10)
			.every("1 minute")
			.usingKey(`ip_${ctx.request.ip()}`);
	},
);
