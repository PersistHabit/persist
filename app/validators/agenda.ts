import vine from "@vinejs/vine";
import {
	CategoryRules,
	DayMomentRules,
	RecurrenceTypeRules,
	RecurrenceUnitRules,
	WeekdayRules,
} from "#types/agenda";

export const agendaEventValidator = vine.create({
	title: vine.string().trim(),
	dayMoment: vine.enum([...DayMomentRules]),
	category: vine.enum([...CategoryRules]),
	startDate: vine.date(),
	endDate: vine.date().optional().nullable(),
	startHour: vine.number().min(0).max(23).optional().nullable(),

	recurrence: vine.object({
		type: vine.enum([...RecurrenceTypeRules]),
		unit: vine
			.enum([...RecurrenceUnitRules])
			.optional()
			.requiredWhen("type", "=", "custom"),

		interval: vine
			.number()
			.min(2)
			.optional()
			.requiredWhen("type", "=", "custom"),

		days: vine
			.array(vine.enum([...WeekdayRules]))
			.optional()
			.requiredWhen((field) => {
				const r = field.parent; // parent = recurrence
				return (
					r.type === "weekly" || (r.type === "custom" && r.unit === "week")
				);
			}),
	}),
});

export const agendaPauseValidator = vine.create({
	startedAt: vine.date(),
	endedAt: vine.date().optional().nullable(),
});
