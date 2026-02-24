import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import AgendaItem from "./agenda_item.js";

export default class AgendaItemPause extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ columnName: "agenda_item_id" })
	declare agendaItemId: number;

	@belongsTo(() => AgendaItem)
	declare agendaItem: BelongsTo<typeof AgendaItem>;

	@column.date()
	declare startedAt: DateTime;

	@column.date()
	declare endedAt: DateTime | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
