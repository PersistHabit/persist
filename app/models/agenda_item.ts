import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import type {
	CategorySlug,
	DayMomentSlug,
	RecurrenceTypeSlug,
	RecurrenceUnitSlug,
} from "#types/agenda";
import User from "./user.js";

export default class AgendaItem extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column({ serializeAs: null })
	declare userId: number;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@column()
	declare title: string;

	@column({ columnName: "day_moment" })
	declare dayMoment: DayMomentSlug;

	@column()
	declare category: CategorySlug;

	@column.date()
	declare startDate: DateTime;

	@column({ columnName: "recurrence_type" })
	declare recurrenceType: RecurrenceTypeSlug;

	@column({ columnName: "recurrence_unit" })
	declare recurrenceUnit: RecurrenceUnitSlug | null;

	@column({ columnName: "recurrence_interval" })
	declare recurrenceInterval: number | null;

	@column({
		columnName: "week_days",
	})
	declare weekDays: number[] | null;

	@column({ columnName: "is_active" })
	declare isActive: boolean;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
