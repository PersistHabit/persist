import { BaseSchema } from "@adonisjs/lucid/schema";
import { MOODS } from "#types/journal";

export default class extends BaseSchema {
	protected tableName = "journals";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.integer("user_id").unsigned().notNullable();
			table
				.foreign("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");

			table.date("entry_date").notNullable();

			table
				.enum(
					"mood",
					MOODS.map((m) => m.value),
					{
						useNative: true,
						enumName: "journal_mood",
						existingType: false,
					},
				)
				.notNullable();

			table.text("content").nullable();

			table.timestamps(true, true);
		});

		this.schema.raw(`
			ALTER TABLE journals
			ADD CONSTRAINT journals_one_per_day_per_user
			UNIQUE (user_id, entry_date);
		`);

		this.schema.raw(`
			CREATE INDEX journals_user_date_idx
			ON journals (user_id, entry_date DESC);
		`);
	}

	async down() {
		this.schema.raw(`DROP INDEX IF EXISTS journals_user_date_idx;`);
		this.schema.dropTable(this.tableName);
		this.schema.raw(`DROP TYPE IF EXISTS journal_mood;`);
	}
}
