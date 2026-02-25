import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import type { Mood } from "#types/journal";
import User from "./user.js";

export default class Journal extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ serializeAs: null })
	declare userId: number;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@column.date()
	declare entryDate: DateTime;

	@column()
	declare mood: Mood;

	@column()
	declare content: string | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
