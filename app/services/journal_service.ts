import { DateTime } from "luxon";
import Journal from "#models/journal";
import type { Mood } from "#types/journal";

export class JournalService {
	async getToday(userId: number) {
		const entryDate = DateTime.now().startOf("day");
		return Journal.query()
			.where("userId", userId)
			.where("entryDate", entryDate.toISODate() ?? "")
			.first();
	}

	async getList(userId: number, page: number, perPage = 15) {
		const today = DateTime.now().startOf("day").toISODate() ?? "";
		return Journal.query()
			.where("userId", userId)
			.where("entryDate", "<", today)
			.orderBy("entryDate", "desc")
			.paginate(page, perPage);
	}

	async upsertToday(userId: number, mood: Mood, content: string | null) {
		const entryDate = DateTime.now().startOf("day");

		if (!content) {
			await Journal.query()
				.where("userId", userId)
				.where("entryDate", entryDate.toISODate() ?? "")
				.delete();
			return;
		}

		await Journal.updateOrCreate({ userId, entryDate }, { mood, content });
	}
}
