import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("medical_specialties")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar", (col) => col.unique().notNull())
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("medical_specialties").ifExists().execute();
}
