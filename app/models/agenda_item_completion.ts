import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import AgendaItem from "./agenda_item.js";

export default class AgendaItemCompletion extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "agenda_item_id" })
	declare agendaItemId: number;

	@belongsTo(() => AgendaItem)
	declare agendaItem: BelongsTo<typeof AgendaItem>;

	@column.date()
	declare occurrenceDate: DateTime;

	@column.dateTime()
	declare completedAt: DateTime;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;
}
