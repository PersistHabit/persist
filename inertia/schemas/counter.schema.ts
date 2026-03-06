import { z } from "zod";
import {
	CounterColorRules,
	CounterDirectionRules,
	CounterTriggerRules,
} from "#types/counter";

export const CounterSchema = z
	.object({
		title: z.string().min(1, "Titre requis").max(255),
		pinned: z.boolean(),
		value: z.number().int().min(0),
		direction: z.enum(CounterDirectionRules),
		trigger: z.enum(CounterTriggerRules),
		color: z.enum(CounterColorRules),
		resetEachDay: z.boolean(),
	})
	.superRefine((data, ctx) => {
		if (data.direction === "decrement" && data.value === 0) {
			ctx.addIssue({
				path: ["value"],
				code: "custom",
				message:
					"La valeur doit être supérieure à 0 pour un compteur décrémentant",
			});
		}
	});

export type CounterInput = z.infer<typeof CounterSchema>;
