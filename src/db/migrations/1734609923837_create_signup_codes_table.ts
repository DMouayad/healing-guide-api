import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("signup_codes")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("email", "varchar", (col) => col.unique())
		.addColumn("phone_number", "varchar(255)", (col) => col.unique().notNull())
		.addColumn("code", "varchar(255)", (col) => col.notNull().unique())
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("signup_codes").ifExists().execute();
}
