import router from "@adonisjs/core/services/router";
import { controllers } from "#generated/controllers";

import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.Agenda, "index"]).as("agenda.index");
		router.post("/", [controllers.Agenda, "store"]).as("agenda.store");
		router.put("/:eventId", [controllers.Agenda, "update"]).as("agenda.update");
		router
			.delete("/:eventId", [controllers.Agenda, "destroy"])
			.as("agenda.destroy");
		router
			.post("/:eventId/pauses", [controllers.Agenda, "storePause"])
			.as("agenda.pauses.store");
		router
			.delete("/:eventId/pauses/:pauseId", [controllers.Agenda, "destroyPause"])
			.as("agenda.pauses.destroy");
	})
	.prefix("agenda")
	.use(middleware.auth());
