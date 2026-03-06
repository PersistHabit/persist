import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "counters";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.boolean("reset_each_day").notNullable().defaultTo(false);
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("reset_each_day");
		});
	}
}
