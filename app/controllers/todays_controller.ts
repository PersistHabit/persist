import type { HttpContext } from "@adonisjs/core/http";

export default class TodaysController {
	async index({ inertia }: HttpContext) {
		return inertia.render("today");
	}
}
