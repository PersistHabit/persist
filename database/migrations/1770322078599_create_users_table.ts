import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments("id").primary();

			table.string("full_name", 150).notNullable();

			table.string("email", 255).nullable();

			table.string("password", 180).notNullable();

			table
				.timestamp("deleted_at", { useTz: true })
				.nullable()
				.index("users_deleted_at_idx");

			table.timestamps(true, true);
		});

		this.schema.raw(`
      CREATE UNIQUE INDEX users_email_unique
      ON users (email)
      WHERE email IS NOT NULL AND deleted_at IS NULL;
    `);

		this.schema.raw(`
      CREATE INDEX users_email_idx
      ON users (email);
    `);
	}

	async down() {
		// Drop indexes explicitement (Postgres)
		this.schema.raw(`DROP INDEX IF EXISTS users_email_idx;`);
		this.schema.raw(`DROP INDEX IF EXISTS users_email_unique;`);

		this.schema.dropTable(this.tableName);
	}
}
