import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("otps")
		.addColumn("hash", "varchar(255)", (col) => col.primaryKey())
		.addColumn("issued_for", "varchar(255)", (col) => col.notNull())
		.addColumn("purpose", "varchar(255)", (col) => col.notNull())
		.addColumn("expires_at", "timestamp", (col) => col.notNull())
		.addUniqueConstraint("unique_issued_for_purpose_expires_at", [
			"purpose",
			"issued_for",
			"expires_at",
		])
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("otps").execute();
}
