import vine from "@vinejs/vine";
import {
	CategoryRules,
	DayMomentRules,
	RecurrenceTypeRules,
	RecurrenceUnitRules,
	WeekdayRules,
} from "#types/agenda";

const agendaEventSchema = vine.object({
	title: vine.string().trim(),
	dayMoment: vine.enum([...DayMomentRules]),
	category: vine.enum([...CategoryRules]),
	startDate: vine.date(),
	endDate: vine.date().optional().nullable(),

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

export const agendaEventValidator = vine.compile(agendaEventSchema);

const agendaPauseSchema = vine.object({
	startedAt: vine.date(),
	endedAt: vine.date().optional().nullable(),
});

export const agendaPauseValidator = vine.compile(agendaPauseSchema);
