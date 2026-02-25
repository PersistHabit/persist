import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";
// biome-ignore lint/style/useImportType: IoC runtime needs this
import { JournalService } from "#services/journal_service";
import { journalValidator } from "#validators/journal";

@inject()
export default class JournalController {
	constructor(protected journalService: JournalService) {}

	async index({ auth, inertia, request }: HttpContext) {
		const { id } = auth.getUserOrFail();
		const page = request.input("page", 1);
		const result = await this.journalService.getList(id, page);
		return inertia.render("journal", {
			entries: result.all().map((e) => e.serialize()),
			meta: result.getMeta(),
		});
	}

	async store({ auth, request, response }: HttpContext) {
		const { id } = auth.getUserOrFail();
		const payload = await request.validateUsing(journalValidator);
		await this.journalService.upsertToday(
			id,
			payload.mood,
			payload.content ?? null,
		);
		return response.redirect().back();
	}
}
