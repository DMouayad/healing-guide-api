import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("languages")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar(255)", (col) => col.unique().notNull())
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("languages").execute();
}
