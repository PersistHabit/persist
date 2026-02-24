import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "agenda_item_completions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.integer("agenda_item_id").unsigned().notNullable();
			table
				.foreign("agenda_item_id")
				.references("id")
				.inTable("agenda_items")
				.onDelete("CASCADE");

			table.date("occurrence_date").notNullable();

			table.timestamp("completed_at").notNullable().defaultTo(this.now());
			table.timestamp("created_at").notNullable().defaultTo(this.now());

			table.unique(["agenda_item_id", "occurrence_date"]);
		});

		this.schema.raw(`
			CREATE INDEX agenda_item_completions_item_date_idx
			ON agenda_item_completions (agenda_item_id, occurrence_date);
		`);
	}

	async down() {
		this.schema.raw(
			`DROP INDEX IF EXISTS agenda_item_completions_item_date_idx;`,
		);
		this.schema.dropTable(this.tableName);
	}
}
