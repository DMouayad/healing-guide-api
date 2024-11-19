import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("roles")
		.addColumn("id", "int4", (col) => col.primaryKey())
		.addColumn("slug", "varchar(255)", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.execute();
	await db.schema.createIndex("roles_slug_index").on("roles").column("slug").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("roles").ifExists().execute();
}
