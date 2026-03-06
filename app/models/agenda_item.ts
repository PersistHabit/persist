import { belongsTo, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { AgendaItemSchema } from "#database/schema";
import AgendaItemCompletion from "./agenda_item_completion.js";
import AgendaItemPause from "./agenda_item_pause.js";
import User from "./user.js";

export default class AgendaItem extends AgendaItemSchema {
	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@hasMany(() => AgendaItemPause)
	declare pauses: HasMany<typeof AgendaItemPause>;

	@hasMany(() => AgendaItemCompletion)
	declare completions: HasMany<typeof AgendaItemCompletion>;
}
