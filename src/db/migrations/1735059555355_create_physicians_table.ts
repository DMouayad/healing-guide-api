import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physicians")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("user_id", "int4", (col) => col.unique().notNull())
		.addColumn("full_name", "varchar", (col) => col.notNull())
		.addColumn("mobile_phone_number", "varchar", (col) => col.notNull())
		.addColumn("phone_number", "varchar")
		.addColumn("biography", "varchar", (col) => col.notNull())
		.addColumn("is_male", "boolean", (col) => col.notNull())
		.addColumn("date_of_birth", "date", (col) => col.notNull())
		.addColumn("picture_url", "varchar")
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addForeignKeyConstraint("user_id_foreign", ["user_id"], "users", ["id"], (cb) =>
			cb.onDelete("cascade"),
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physicians").ifExists().execute();
}
