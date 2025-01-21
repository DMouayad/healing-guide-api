import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("facility_departments")
		.addColumn("facility_id", "int4")
		.addColumn("type_id", "int4")
		.addPrimaryKeyConstraint("facility_departments_PK", ["facility_id", "type_id"])
		.addForeignKeyConstraint(
			"facility_departments_facility_id_FK",
			["facility_id"],
			"medical_facilities",
			["id"],
		)
		.addForeignKeyConstraint(
			"facility_departments_type_id_FK",
			["type_id"],
			"facility_types",
			["id"],
		)
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("facility_departments").ifExists().execute();
}
