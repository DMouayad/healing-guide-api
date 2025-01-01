import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physician_feedback_categories")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("name", "varchar", (col) => col.unique().notNull())
		.addColumn("parent_category_id", "integer")
		.addForeignKeyConstraint(
			"physician_feedback_categories_foreign_key",
			["parent_category_id"],
			"physician_feedback_categories",
			["id"],
			(cb) => cb.onDelete("cascade"),
		)
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physician_feedback_categories").ifExists().execute();
}
