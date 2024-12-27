import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physicians_treat_conditions")
		.addColumn("physician_id", "int4")
		.addColumn("condition_id", "int4")
		.addPrimaryKeyConstraint("physicians_treat_conditions_PK", [
			"physician_id",
			"condition_id",
		])
		.addForeignKeyConstraint(
			"physicians_treat_conditions_condition_id_FK",
			["condition_id"],
			"medical_conditions",
			["id"],
		)
		.addForeignKeyConstraint(
			"physicians_treat_conditions_physician_id_FK",
			["physician_id"],
			"physicians",
			["id"],
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physicians_treat_conditions").ifExists().execute();
}
