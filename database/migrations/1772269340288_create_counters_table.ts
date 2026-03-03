import { BaseSchema } from "@adonisjs/lucid/schema";
import {
	CounterColorRules,
	CounterDirectionRules,
	CounterTriggerRules,
} from "#types/counter";

export default class extends BaseSchema {
	protected tableName = "counters";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.integer("user_id").unsigned().notNullable();
			table
				.foreign("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table.boolean("pinned").notNullable().defaultTo(false);
			table.string("title").notNullable();
			table.enum("direction", CounterDirectionRules).notNullable();
			table.enum("trigger", CounterTriggerRules).notNullable();
			table.integer("initial_value").defaultTo(0).notNullable();
			table.integer("value").defaultTo(0).notNullable();
			table.enum("color", CounterColorRules).notNullable();

			table.timestamps(true, true);
		});

		this.schema.raw(`
			CREATE INDEX counters_user_id_idx
			ON counters (user_id);
		`);
	}

	async down() {
		this.schema.raw(`DROP INDEX IF EXISTS counters_user_id_idx;`);
		this.schema.dropTable(this.tableName);
	}
}
