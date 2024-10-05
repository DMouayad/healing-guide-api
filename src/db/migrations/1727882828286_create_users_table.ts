import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("users")
		.addColumn("id", "bigserial", (col) => col.primaryKey())
		.addColumn("role_id", "int8", (col) => col.notNull())
		.addForeignKeyConstraint("role_id_foreign", ["role_id"], "roles", ["id"], (cb) => cb.onDelete("set null"))
		.addColumn("full_name", "varchar(255)", (col) => col.notNull())
		.addColumn("email", "varchar(255)", (col) => col.notNull().unique())
		.addColumn("phone_number", "varchar(255)", (col) => col.notNull().unique())
		.addColumn("password_hash", "varchar", (col) => col.notNull().unique())
		.addColumn("email_verified_at", "timestamp")
		.addColumn("phone_number_verified_at", "timestamp")
		.addColumn("activated", "boolean", (col) => col.defaultTo(false).notNull())
		.addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("users").ifExists().execute();
}
