import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "counters";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.date("last_applied_date").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("last_applied_date");
		});
	}
}
