import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("sessions")
		.ifNotExists()
		.addColumn("sid", sql`varchar NOT NULL COLLATE "default"`, (cb) => cb.primaryKey())
		.addColumn("sess", "json", (cb) => cb.notNull())
		.addColumn("expire", "timestamp(6)", (cb) => cb.notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("sessions").execute();
}
