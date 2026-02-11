import { z } from "zod";
import {
	CategoryRules,
	DayMomentRules,
	RecurrenceTypeRules,
	RecurrenceUnitRules,
	WeekdayRules,
} from "#types/agenda";

export const RecurrenceSchema = z
	.object({
		type: z.enum(RecurrenceTypeRules),
		interval: z.number().int().positive().optional(),
		unit: z.enum(RecurrenceUnitRules).optional(),
		days: z.array(z.enum(WeekdayRules)).default([]),
	})
	.transform((recurrence) => {
		const noDays =
			recurrence.type === "once" ||
			recurrence.type === "daily" ||
			recurrence.type === "monthly" ||
			(recurrence.type === "custom" && recurrence.unit === "month");

		if (noDays) {
			return { ...recurrence, days: [] };
		}

		return recurrence;
	})
	.superRefine((recurrence, ctx) => {
		const t = recurrence.type;

		// ✅ RÈGLES "DB-like"
		const isCustom = t === "custom";

		// custom => unit + interval requis
		if (isCustom) {
			if (recurrence.unit === null) {
				ctx.addIssue({
					path: ["unit"],
					code: "custom",
					message: "L’unité est requise quand la récurrence est personnalisée",
				});
			}
			if (recurrence.interval === null) {
				ctx.addIssue({
					path: ["interval"],
					code: "custom",
					message:
						"L’intervalle est requis quand la récurrence est personnalisée",
				});
			}
		} else {
			// non-custom => unit + interval interdits
			if (recurrence.unit !== null) {
				ctx.addIssue({
					path: ["unit"],
					code: "custom",
					message:
						"L’unité doit être vide sauf si la récurrence est personnalisée",
				});
			}
			if (recurrence.interval !== null) {
				ctx.addIssue({
					path: ["interval"],
					code: "custom",
					message:
						"L’intervalle doit être vide sauf si la récurrence est personnalisée",
				});
			}
		}

		// days non-null uniquement si weekly ou custom
		if (recurrence.days.length > 0 && !["weekly", "custom"].includes(t)) {
			ctx.addIssue({
				path: ["days"],
				code: "custom",
				message: "Les jours ne peuvent être définis que pour weekly ou custom",
			});
		}

		const daysCount = recurrence.days?.length ?? 0;

		const noDays =
			t === "once" ||
			t === "daily" ||
			t === "monthly" ||
			(t === "custom" && recurrence.unit === "month");

		const needsDays =
			t === "weekly" || (t === "custom" && recurrence.unit === "week");

		if (noDays && daysCount > 0) {
			ctx.addIssue({
				path: ["days"],
				code: "custom",
				message: "Aucun jour requis pour cette récurrence",
			});
		}

		if (needsDays && daysCount === 0) {
			ctx.addIssue({
				path: ["days"],
				code: "custom",
				message: "Sélectionne au moins un jour",
			});
		}
	});

export const NewEventSchema = z.object({
	title: z.string().min(1, "Titre requis"),
	dayMoment: z.enum(DayMomentRules),
	category: z.enum(CategoryRules),
	startDate: z.string(),
	recurrence: RecurrenceSchema,
});

export type NewEventInput = z.infer<typeof NewEventSchema>;
