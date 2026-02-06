/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import type { HttpContext } from "@adonisjs/core/http";
import router from "@adonisjs/core/services/router";

import "./routes/auth.js";
import { middleware } from "./kernel.js";

router
	.get("/", async ({ inertia, auth }: HttpContext) => {
		const user = await auth.authenticate();
		return inertia.render("home", {
			user,
		});
	})
	.use(middleware.auth());
