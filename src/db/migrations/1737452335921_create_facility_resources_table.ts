import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("facility_resources")
		.addColumn("id", "serial", (cb) => cb.primaryKey())
		.addColumn("facility_id", "int4", (cb) => cb.notNull())
		.addColumn("category_id", "int4", (cb) => cb.notNull())
		.addColumn("title", "varchar(255)", (cb) => cb.notNull())
		.addColumn("content", "text", (cb) => cb.notNull())
		.addForeignKeyConstraint(
			"facility_resources_medical_facilities_FK",
			["facility_id"],
			"medical_facilities",
			["id"],
		)
		.addForeignKeyConstraint(
			"facility_resources_facility_resource_categories_FK",
			["category_id"],
			"facility_resource_categories",
			["id"],
		)
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("facility_resources").ifExists().execute();
}
