import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import Counter from "#models/counter";
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

		const moods = ["great", "good", "neutral", "meh", "bad"] as const;
		const contents = [
			"Bonne semaine qui commence, j'ai réussi à méditer le matin sans me forcer.",
			"Journée correcte mais un peu fatiguée. Lecture le soir m'a aidé à décompresser.",
			"Super séance de sport ce matin ! Je me sens vraiment bien après. Repas sain à midi aussi.",
			"Difficile de me concentrer aujourd'hui. J'ai quand même fait ma méditation.",
			"La journée était pas mal, rien de particulier à noter.",
			"Journée difficile, beaucoup de stress. J'ai manqué ma session de sport.",
			"Très bonne journée, j'étais dans un état de flow pendant plusieurs heures.",
			"Réveil compliqué mais la méditation a tout changé. Belle fin de journée.",
			"Réussi à tenir mes habitudes malgré un planning chargé. Fierté.",
			"Grosse fatigue accumulée, il faut que je dorme plus.",
			"Lecture inspirante ce soir, plein de nouvelles idées.",
			"Sport intense, je suis épuisé mais satisfait.",
			"Journée calme et productive, exactement ce qu'il me fallait.",
			"Un peu d'anxiété ce matin, la méditation a beaucoup aidé.",
			"Belle connexion avec mes proches aujourd'hui.",
			"Trop de temps sur les écrans, il faut que je rééquilibre.",
			"Excellent repas fait maison, je prends soin de moi.",
			"Matinée en plein air, ça ressource vraiment.",
			"Difficulté à me lever mais une fois lancé, super journée.",
			"Méditation de 20 minutes ce matin, je me sens ancré.",
			"Journée mitigée, quelques tensions au travail.",
			"Soir calme avec un bon livre, parfait pour recharger.",
			"Séance de sport courte mais efficace, 30 minutes suffisent.",
			"Journée riche en émotions, beaucoup de gratitude ce soir.",
			"Moins bien aujourd'hui, besoin de repos.",
			"Nouvelle routine testée ce matin, prometteuse.",
			"Bonne humeur contagieuse toute la journée.",
			"Trop de choses en tête, difficile de lâcher prise.",
			"Petit déjeuner sain et méditation : combo gagnant.",
			"Journée de travail intense, mais les habitudes tenues.",
			"Magnifique coucher de soleil, moment de pleine conscience.",
			"Repas préparé avec soin, je mange mieux depuis quelques semaines.",
			"Sport dehors pour la première fois de la semaine, quelle différence !",
			"Soir paisible, je prends le temps de réfléchir.",
			"Quelques doutes mais je reste sur le chemin.",
			"Journée ensoleillée, humeur au beau fixe.",
			"Sommeil de qualité, tout est plus facile aujourd'hui.",
			"Moment de gratitude le soir, pratique que j'adopte.",
			"Journée avec des hauts et des bas, c'est la vie.",
			"Belle progression sur mes habitudes ce mois-ci.",
			"Pris du temps pour moi, c'était nécessaire.",
			"Petite victoire du jour : n'ai pas cédé au grignotage.",
			"Longue marche ce soir, pensées clarifiées.",
			"Musique et lecture, soirée idéale.",
			"Fatigue mais satisfaction d'avoir honoré mes engagements.",
			"Journée sociale riche, plein d'énergie positive.",
			"Retour aux bases : eau, sommeil, mouvement.",
			"Bilan de la semaine positif, continuons.",
			"Nouvelle semaine qui commence bien, optimisme de mise.",
			"Réflexion du soir : je progresse doucement mais sûrement.",
		];

		await Counter.createMany([
			{
				userId: user.id,
				pinned: true,
				title: "Verres d'eau",
				direction: "increment",
				trigger: "manual",
				initialValue: 0,
				value: 3,
				color: "streak-0",
				lastAppliedDate: DateTime.now().startOf("day"),
				resetEachDay: true,
			},
			{
				userId: user.id,
				pinned: true,
				title: "Cigarettes",
				direction: "decrement",
				trigger: "manual",
				initialValue: 10,
				value: 7,
				color: "countdown-0",
				lastAppliedDate: DateTime.now().startOf("day"),
				resetEachDay: false,
			},
			{
				userId: user.id,
				pinned: false,
				title: "Pages lues",
				direction: "increment",
				trigger: "manual",
				initialValue: 0,
				value: 42,
				color: "streak-1",
				lastAppliedDate: DateTime.now().minus({ days: 1 }).startOf("day"),
				resetEachDay: false,
			},
			{
				userId: user.id,
				pinned: false,
				title: "Séances de sport",
				direction: "increment",
				trigger: "daily",
				initialValue: 0,
				value: 12,
				color: "streak-2",
				lastAppliedDate: DateTime.now().minus({ days: 2 }).startOf("day"),
				resetEachDay: false,
			},
		]);

		await Journal.createMany(
			Array.from({ length: 50 }, (_, i) => ({
				userId: user.id,
				entryDate: DateTime.now()
					.minus({ days: i + 1 })
					.startOf("day"),
				mood: moods[i % moods.length],
				content: contents[i % contents.length],
			})),
		);
	}
}
