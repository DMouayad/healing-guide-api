import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("identity_confirmation_codes")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("user_id", "int4", (col) => col.notNull())
		.addColumn("code", "varchar(255)", (col) => col.notNull())
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.addForeignKeyConstraint("user_id_foreign", ["user_id"], "users", ["id"], (cb) =>
			cb.onDelete("cascade"),
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("identity_confirmation_codes").ifExists().execute();
}
