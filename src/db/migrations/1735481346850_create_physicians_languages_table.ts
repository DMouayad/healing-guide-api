import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physicians_languages")
		.addColumn("physician_id", "int4")
		.addColumn("language_id", "int4")
		.addPrimaryKeyConstraint("physicians_languages_PK", ["physician_id", "language_id"])
		.addForeignKeyConstraint(
			"physicians_languages_language_id_FK",
			["language_id"],
			"languages",
			["id"],
		)
		.addForeignKeyConstraint(
			"physicians_languages_physician_id_FK",
			["physician_id"],
			"physicians",
			["id"],
		)
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physicians_languages").ifExists().execute();
}
