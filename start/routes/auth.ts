import router from "@adonisjs/core/services/router";

import { controllers } from "#generated/controllers";

import { middleware } from "#start/kernel";
import { authGuestThrottle } from "#start/limiter";

router
	.group(() => {
		router.on("/login").renderInertia("auth/login", {}).as("page.login");
		router
			.on("/register")
			.renderInertia("auth/register", {})
			.as("page.register");

		router
			.group(() => {
				router.post("/login", [controllers.Session, "login"]).as("auth.login");
				router
					.post("/register", [controllers.Session, "register"])
					.as("auth.register");
			})
			.prefix("auth")
			.use(authGuestThrottle);
	})
	.use(middleware.guest());

router.delete("/auth", [controllers.Session, "logout"]).use(middleware.auth());
