import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("personal_access_tokens")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("user_id", "int4", (col) => col.notNull())
		.addColumn("fingerprint", "varchar(255)")
		.addColumn("hash", "varchar(64)", (col) => col.unique().notNull())
		.addColumn("last_used_at", "timestamp")
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addForeignKeyConstraint("user_id_foreign", ["user_id"], "users", ["id"], (cb) =>
			cb.onDelete("cascade"),
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("personal_access_tokens").ifExists().execute();
}
