import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("facility_feedback_questions")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("category_id", "int4", (col) => col.notNull())
		.addColumn("question", "varchar", (col) => col.unique().notNull())
		.addForeignKeyConstraint(
			"facility_feedback_questions_category_id_FK",
			["category_id"],
			"facility_feedback_categories",
			["id"],
			(cb) => cb.onDelete("cascade"),
		)
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("facility_feedback_questions").ifExists().execute();
}
