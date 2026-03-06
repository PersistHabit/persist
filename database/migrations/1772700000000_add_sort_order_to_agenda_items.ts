import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "agenda_items";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.smallint("start_hour").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("start_hour");
		});
	}
}
