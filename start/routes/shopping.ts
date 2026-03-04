import router from "@adonisjs/core/services/router";
import { controllers } from "#generated/controllers";
import { middleware } from "#start/kernel";

router
	.group(() => {
		router.get("/", [controllers.Shoppings, "index"]);
		router.post("/", [controllers.Shoppings, "store"]);
		router.patch("/:shoppingItemId/done", [
			controllers.Shoppings,
			"markAsDone",
		]);
		router.patch("/:shoppingItemId/undone", [
			controllers.Shoppings,
			"markAsUndone",
		]);
		router.patch("/:shoppingItemId/pin", [controllers.Shoppings, "pin"]);
		router.patch("/:shoppingItemId/unpin", [controllers.Shoppings, "unPin"]);
		router.put("/:shoppingItemId", [controllers.Shoppings, "update"]);
		router.delete("/:shoppingItemId", [controllers.Shoppings, "destroy"]);
	})
	.prefix("shopping")
	.use(middleware.auth());
