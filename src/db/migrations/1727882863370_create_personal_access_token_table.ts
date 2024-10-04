import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("personal_access_tokens")
		.addColumn("id", "bigserial", (col) => col.primaryKey())
		.addColumn("user_id", "bigserial", (col) => col.notNull())
		.addColumn("fingerprint", "varchar(255)")
		.addColumn("token", "varchar(64)", (col) => col.unique().notNull())
		.addColumn("last_used_at", "timestamp")
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addForeignKeyConstraint("user_id_foreign", ["user_id"], "users", ["id"])
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("personal_access_tokens").ifExists().execute();
}
