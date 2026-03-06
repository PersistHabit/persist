import vine from "@vinejs/vine";
import {
	CounterColorRules,
	CounterDirectionRules,
	CounterTriggerRules,
} from "#types/counter";

export const counterValidator = vine.create({
	title: vine.string().trim().minLength(1).maxLength(255),
	pinned: vine.boolean(),
	value: vine.number().min(0),
	direction: vine.enum([...CounterDirectionRules]),
	trigger: vine.enum([...CounterTriggerRules]),
	color: vine.enum([...CounterColorRules]),
	resetEachDay: vine.boolean(),
});
