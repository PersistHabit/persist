import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "remember_me_tokens";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id");

			table
				.integer("tokenable_id")
				.unsigned()
				.notNullable()
				.index("remember_me_tokens_tokenable_id_idx");

			table
				.foreign("tokenable_id", "remember_me_tokens_tokenable_id_fk")
				.references("users.id")
				.onDelete("CASCADE");

			table.string("hash", 255).notNullable().unique();
			table
				.timestamp("expires_at", { useTz: true })
				.notNullable()
				.index("remember_me_tokens_expires_at_idx");

			table.timestamps(true, true);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
