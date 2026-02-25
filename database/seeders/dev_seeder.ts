import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import Journal from "#models/journal";
import User from "#models/user";

export default class extends BaseSeeder {
	static environment: string[] = ["development"];

	async run() {
		const user = await User.firstOrCreate({
			fullName: "Clément",
			email: "clement.mistral@proton.me",
			password: "Clement2607*",
		});

		await AgendaItem.createMany([
			{
				userId: user.id,
				title: "Méditation",
				dayMoment: "morning",
				category: "spirituality",
				startDate: DateTime.now().startOf("day"),
				endDate: null,
				recurrenceType: "daily",
				recurrenceUnit: null,
				recurrenceInterval: null,
				weekDays: null,
				isActive: true,
			},
			{
				userId: user.id,
				title: "Sport",
				dayMoment: "morning",
				category: "sport",
				startDate: DateTime.now().startOf("day"),
				endDate: null,
				recurrenceType: "weekly",
				recurrenceUnit: null,
				recurrenceInterval: null,
				weekDays: [1, 3, 5], // lun, mer, ven
				isActive: true,
			},
			{
				userId: user.id,
				title: "Lecture",
				dayMoment: "evening",
				category: "learning",
				startDate: DateTime.now().startOf("day"),
				endDate: null,
				recurrenceType: "daily",
				recurrenceUnit: null,
				recurrenceInterval: null,
				weekDays: null,
				isActive: true,
			},
			{
				userId: user.id,
				title: "Repas sain",
				dayMoment: "afternoon",
				category: "nutrition",
				startDate: DateTime.now().startOf("day"),
				endDate: null,
				recurrenceType: "daily",
				recurrenceUnit: null,
				recurrenceInterval: null,
				weekDays: null,
				isActive: true,
			},
		]);

		await Journal.createMany([
			{
				userId: user.id,
				entryDate: DateTime.now().minus({ days: 6 }).startOf("day"),
				mood: "good",
				content:
					"Bonne semaine qui commence, j'ai réussi à méditer le matin sans me forcer.",
			},
			{
				userId: user.id,
				entryDate: DateTime.now().minus({ days: 5 }).startOf("day"),
				mood: "neutral",
				content:
					"Journée correcte mais un peu fatiguée. Lecture le soir m'a aidé à décompresser.",
			},
			{
				userId: user.id,
				entryDate: DateTime.now().minus({ days: 4 }).startOf("day"),
				mood: "great",
				content:
					"Super séance de sport ce matin ! Je me sens vraiment bien après. Repas sain à midi aussi.",
			},
			{
				userId: user.id,
				entryDate: DateTime.now().minus({ days: 3 }).startOf("day"),
				mood: "meh",
				content:
					"Difficile de me concentrer aujourd'hui. J'ai quand même fait ma méditation.",
			},
			{
				userId: user.id,
				entryDate: DateTime.now().minus({ days: 2 }).startOf("day"),
				mood: "good",
				content: "La journée était pas mal",
			},
			{
				userId: user.id,
				entryDate: DateTime.now().minus({ days: 1 }).startOf("day"),
				mood: "bad",
				content:
					"Journée difficile, beaucoup de stress. J'ai manqué ma session de sport.",
			},
		]);
	}
}
