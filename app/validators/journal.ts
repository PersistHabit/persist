import vine from "@vinejs/vine";
import { MOODS } from "#types/journal";

export const journalValidator = vine.create({
	mood: vine.enum(MOODS.map((m) => m.value)),
	content: vine.string().trim().nullable().optional(),
});
