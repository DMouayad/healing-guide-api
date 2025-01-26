import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("patient_visitor_resource_categories")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar(255)", (col) => col.unique().notNull())
		.addColumn("description", "varchar(255)")
		.addColumn("icon_name", "varchar(255)")
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("patient_visitor_resource_categories").execute();
}
