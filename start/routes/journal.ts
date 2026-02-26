import router from "@adonisjs/core/services/router";
import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.Journal, "index"]).as("journal.index");
		router.post("/", [controllers.Journal, "store"]).as("journal.store");
	})
	.prefix("/journal")
	.use(middleware.auth());
