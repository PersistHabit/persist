import { BaseSchema } from "@adonisjs/lucid/schema";
import {
	CategoryRules,
	DayMomentRules,
	RecurrenceTypeRules,
	RecurrenceUnitRules,
} from "#types/agenda";

export default class extends BaseSchema {
	protected tableName = "agenda_items";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.integer("user_id").unsigned().notNullable();
			table
				.foreign("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");

			table.string("title", 180).notNullable();

			table
				.enum("day_moment", [...DayMomentRules], {
					useNative: true,
					enumName: "agenda_day_moment",
					existingType: false,
				})
				.notNullable();

			table
				.enum("category", [...CategoryRules], {
					useNative: true,
					enumName: "agenda_category",
					existingType: false,
				})
				.notNullable();

			table.date("start_date").notNullable();

			table
				.enum("recurrence_type", [...RecurrenceTypeRules], {
					useNative: true,
					enumName: "agenda_recurrence_type",
					existingType: false,
				})
				.notNullable();

			table
				.enum("recurrence_unit", [...RecurrenceUnitRules], {
					useNative: true,
					enumName: "agenda_recurrence_unit",
					existingType: false,
				})
				.nullable();

			table.integer("recurrence_interval").nullable();

			table.specificType("week_days", "smallint[]").nullable();

			table.boolean("is_active").notNullable().defaultTo(true);

			table.timestamps(true, true);
		});

		this.schema.raw(`
			ALTER TABLE agenda_items
			ADD CONSTRAINT agenda_items_custom_requires_unit_interval
			CHECK (
				(recurrence_type = 'custom' AND recurrence_unit IS NOT NULL AND recurrence_interval IS NOT NULL)
				OR
				(recurrence_type <> 'custom' AND recurrence_unit IS NULL AND recurrence_interval IS NULL)
			);
		`);

		this.schema.raw(`
			ALTER TABLE agenda_items
			ADD CONSTRAINT agenda_items_week_days_only_for_weekly_or_custom
			CHECK (
				(week_days IS NULL)
				OR
				(recurrence_type IN ('weekly', 'custom'))
			);
		`);

		// Index orienté usage réel (Aujourd’hui / stats / filtres user)
		this.schema.raw(`
			CREATE INDEX agenda_items_user_active_start_idx
			ON agenda_items (user_id, is_active, start_date);
		`);
	}

	async down() {
		this.schema.raw(`DROP INDEX IF EXISTS agenda_items_user_active_start_idx;`);
		this.schema.raw(`
			ALTER TABLE agenda_items
			DROP CONSTRAINT IF EXISTS agenda_items_week_days_only_for_weekly_or_custom;	
		`);
		this.schema.raw(`
			ALTER TABLE agenda_items
			DROP CONSTRAINT IF EXISTS agenda_items_custom_requires_unit_interval;	
		`);
		this.schema.dropTable(this.tableName);
		this.schema.raw(`DROP TYPE IF EXISTS agenda_day_moment;`);
		this.schema.raw(`DROP TYPE IF EXISTS agenda_category;`);
		this.schema.raw(`DROP TYPE IF EXISTS agenda_recurrence_type;`);
		this.schema.raw(`DROP TYPE IF EXISTS agenda_recurrence_unit;`);
	}
}
