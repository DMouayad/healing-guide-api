import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physician_reviews")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("physician_id", "int4", (col) => col.notNull())
		.addColumn("reviewer_id", "int4", (col) => col.notNull())
		.addColumn("reviewer_name", "varchar(255)")
		.addColumn("review_text", "varchar(500)", (col) => col.notNull())
		.addColumn("review_stars", "int4", (col) =>
			col.check(sql`review_stars BETWEEN 0 AND 5`),
		)
		.addColumn("written_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addForeignKeyConstraint("physician_reviews_users_FK", ["reviewer_id"], "users", [
			"id",
		])
		.addForeignKeyConstraint(
			"physician_reviews_physicians_FK",
			["physician_id"],
			"physicians",
			["id"],
		)
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physician_reviews").ifExists().execute();
}
