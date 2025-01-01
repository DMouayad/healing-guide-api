import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physicians_specialties")
		.addColumn("physician_id", "int4")
		.addColumn("specialty_id", "int4")
		.addPrimaryKeyConstraint("physicians_specialties_PK", [
			"physician_id",
			"specialty_id",
		])
		.addForeignKeyConstraint(
			"physicians_specialties_specialty_id_FK",
			["specialty_id"],
			"medical_specialties",
			["id"],
		)
		.addForeignKeyConstraint(
			"physicians_specialties_physician_id_FK",
			["physician_id"],
			"physicians",
			["id"],
		)
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physicians_specialties").ifExists().execute();
}
