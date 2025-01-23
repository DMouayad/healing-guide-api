import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("facility_feedback_categories")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar", (col) => col.unique().notNull())
		.addColumn("parent_category_id", "integer")
		.addForeignKeyConstraint(
			"facility_feedback_categories_foreign_key",
			["parent_category_id"],
			"facility_feedback_categories",
			["id"],
			(cb) => cb.onDelete("cascade"),
		)
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("facility_feedback_categories").ifExists().execute();
}
