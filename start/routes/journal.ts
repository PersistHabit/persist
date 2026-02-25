import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";

const JournalController = () => import("#controllers/journal_controller");

router
	.group(() => {
		router.get("/", [JournalController, "index"]).as("journal.index");
		router.post("/", [JournalController, "store"]).as("journal.store");
	})
	.prefix("/journal")
	.use(middleware.auth());
