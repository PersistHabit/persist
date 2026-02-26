import router from "@adonisjs/core/services/router";
import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.Todays, "index"]).as("today.index");
		router
			.post("/agenda-items/:itemId/completions", [
				controllers.Todays,
				"storeCompletion",
			])
			.as("today.completions.store");
		router
			.delete("/agenda-items/:itemId/completions/:completionId", [
				controllers.Todays,
				"destroyCompletion",
			])
			.as("today.completions.destroy");
	})
	.use(middleware.auth());
