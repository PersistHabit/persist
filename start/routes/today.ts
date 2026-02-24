const TodaysController = () => import("#controllers/todays_controller");

import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [TodaysController, "index"]).as("today.index");
		router
			.post("/agenda-items/:itemId/completions", [
				TodaysController,
				"storeCompletion",
			])
			.as("today.completions.store");
		router
			.delete("/agenda-items/:itemId/completions/:completionId", [
				TodaysController,
				"destroyCompletion",
			])
			.as("today.completions.destroy");
	})
	.use(middleware.auth());
