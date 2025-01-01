import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physicians_provided_procedures")
		.addColumn("physician_id", "int4")
		.addColumn("procedure_id", "int4")
		.addPrimaryKeyConstraint("physicians_provided_procedures_PK", [
			"physician_id",
			"procedure_id",
		])
		.addForeignKeyConstraint(
			"physicians_provided_procedures_procedure_id_FK",
			["procedure_id"],
			"medical_procedures",
			["id"],
		)
		.addForeignKeyConstraint(
			"physicians_provided_procedures_physician_id_FK",
			["physician_id"],
			"physicians",
			["id"],
		)
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physicians_provided_procedures").ifExists().execute();
}
