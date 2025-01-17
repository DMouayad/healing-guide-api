import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("password_resets")
		.addColumn("token", "varchar", (cb) => cb.primaryKey().notNull())
		.addColumn("hash", "varchar", (cb) => cb.notNull())
		.addColumn("issued_for", "varchar", (cb) => cb.notNull())
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("password_resets").execute();
}
