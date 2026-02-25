import vine from "@vinejs/vine";
import { MOODS } from "#types/journal";

const journalSchema = vine.object({
	mood: vine.enum(MOODS.map((m) => m.value)),
	content: vine.string().trim().nullable().optional(),
});

export const journalValidator = vine.compile(journalSchema);
