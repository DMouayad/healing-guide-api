import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("email_verification_codes")
		.addColumn("user_id", "int4", (col) => col.notNull())
		.addColumn("code", "varchar(10)", (col) => col.notNull())
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.addForeignKeyConstraint("user_id_foreign", ["user_id"], "users", ["id"], (cb) =>
			cb.onDelete("cascade"),
		)
		.addPrimaryKeyConstraint("email_verification_codes_PK", ["user_id", "code"])
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("email_verification_codes").ifExists().execute();
}
