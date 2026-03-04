import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "agenda_item_pauses";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.integer("agenda_item_id").unsigned().notNullable();
			table
				.foreign("agenda_item_id")
				.references("id")
				.inTable("agenda_items")
				.onDelete("CASCADE");

			table.date("started_at").notNullable();
			table.date("ended_at").nullable();

			table.timestamps(true, true);
		});

		this.schema.raw(`
			ALTER TABLE agenda_item_pauses
			ADD CONSTRAINT agenda_item_pauses_ended_after_started
			CHECK (ended_at IS NULL OR ended_at >= started_at);
		`);

		this.schema.raw(`
			CREATE INDEX agenda_item_pauses_item_ended_idx
			ON agenda_item_pauses (agenda_item_id, ended_at);
		`);
	}

	async down() {
		this.schema.raw(`DROP INDEX IF EXISTS agenda_item_pauses_item_ended_idx;`);
		this.schema.raw(`
			ALTER TABLE agenda_item_pauses
			DROP CONSTRAINT IF EXISTS agenda_item_pauses_ended_after_started;
		`);
		this.schema.dropTable(this.tableName);
	}
}
