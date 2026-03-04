import router from "@adonisjs/core/services/router";
import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.Counters, "index"]);
		router.post("/", [controllers.Counters, "store"]);
		router.patch("/:counterId/increment", [controllers.Counters, "increment"]);
		router.patch("/:counterId/decrement", [controllers.Counters, "decrement"]);
		router.patch("/:counterId/reset", [controllers.Counters, "reset"]);
		router.put("/:counterId", [controllers.Counters, "update"]);
		router.delete("/:counterId", [controllers.Counters, "destroy"]);
	})
	.prefix("counters")
	.use(middleware.auth());
