import router from "@adonisjs/core/services/router";
import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.Stats, "index"]).as("stats.index");
	})
	.prefix("stats")
	.use(middleware.auth());
