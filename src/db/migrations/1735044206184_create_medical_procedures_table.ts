import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("medical_procedures")
		.addColumn("id", "bigserial", (col) => col.primaryKey())
		.addColumn("name", "varchar", (col) => col.unique().notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("medical_procedures").ifExists().execute();
}
