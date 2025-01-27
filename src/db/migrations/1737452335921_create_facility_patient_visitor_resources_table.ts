import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("facility_patient_visitor_resources")
		.addColumn("id", "serial", (cb) => cb.primaryKey())
		.addColumn("facility_id", "int4", (cb) => cb.notNull())
		.addColumn("category_id", "int4", (cb) => cb.notNull())
		.addColumn("title", "varchar(255)", (cb) => cb.notNull())
		.addColumn("content", "text", (cb) => cb.notNull())
		.addColumn("summary", "text")
		.addColumn("status", "varchar(50)", (cb) => cb.notNull())
		.addColumn("published_at", "timestamp")
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addForeignKeyConstraint(
			"facility_patient_visitor_resources_medical_facilities_FK",
			["facility_id"],
			"medical_facilities",
			["id"],
		)
		.addForeignKeyConstraint(
			"facility_patient_visitor_resources_patient_visitor_resource_categories_FK",
			["category_id"],
			"patient_visitor_resource_categories",
			["id"],
		)
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("facility_patient_visitor_resources").ifExists().execute();
}
