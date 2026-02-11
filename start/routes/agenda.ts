import router from "@adonisjs/core/services/router";

const AgendaController = () => import("#controllers/agenda_controller");

import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [AgendaController, "index"]).as("agenda.index");
		router.post("/", [AgendaController, "store"]).as("agenda.store");
		router.put("/:eventId", [AgendaController, "update"]).as("agenda.update");
		router
			.delete("/:eventId", [AgendaController, "destroy"])
			.as("agenda.destroy");
	})
	.prefix("agenda")
	.use(middleware.auth());
