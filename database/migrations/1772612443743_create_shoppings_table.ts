import { BaseSchema } from "@adonisjs/lucid/schema";
import { ShoppingCategoryRules } from "#types/shopping";

export default class extends BaseSchema {
	protected tableName = "shoppings";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.integer("user_id").unsigned().notNullable();
			table
				.foreign("user_id")
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");

			table.string("name", 180).notNullable();
			table
				.enum("category", [...ShoppingCategoryRules], {
					useNative: true,
					enumName: "shopping_category",
					existingType: false,
				})
				.notNullable();
			table.boolean("pinned").notNullable().defaultTo(false);
			table.boolean("done").notNullable().defaultTo(false);

			table.timestamps(true, true);
		});

		this.schema.raw(`
			CREATE INDEX shoppings_user_pinned_idx
			ON shoppings (user_id, pinned);
		`);
	}

	async down() {
		this.schema.raw(`DROP INDEX IF EXISTS shoppings_user_pinned_idx;`);
		this.schema.dropTable(this.tableName);
		this.schema.raw(`DROP TYPE IF EXISTS shopping_category;`);
	}
}
