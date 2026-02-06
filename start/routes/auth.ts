import router from "@adonisjs/core/services/router";

const SessionController = () => import("#controllers/session_controller");

import { middleware } from "#start/kernel";
import { authGuestThrottle } from "#start/limiter";

router
	.group(() => {
		router.on("/login").renderInertia("auth/login").as("page.login");
		router.on("/register").renderInertia("auth/register").as("page.register");

		router
			.group(() => {
				router.post("/login", [SessionController, "login"]).as("auth.login");
				router
					.post("/register", [SessionController, "register"])
					.as("auth.register");
			})
			.prefix("auth")
			.use(authGuestThrottle);
	})
	.use(middleware.guest());

router.delete("/auth", [SessionController, "logout"]).use(middleware.auth());
