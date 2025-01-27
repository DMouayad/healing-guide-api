import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("medical_facilities")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("manager_id", "integer", (col) => col.notNull())
		.addColumn("facility_type_id", "integer", (col) => col.notNull())
		.addColumn("name", "varchar", (col) => col.notNull().unique())
		.addColumn("address", "varchar", (col) => col.notNull())
		.addColumn("location", sql`geometry('POINT', 4326)`, (col) => col.notNull())
		.addColumn("emergency_phone_number", "varchar")
		.addColumn("appointments_phone_number", "varchar", (col) => col.notNull())
		.addColumn("mobile_phone_number", "varchar")
		.addColumn("avatar_url", "varchar")
		.addColumn("created_at", "timestamp", (col) => col.defaultTo("now()").notNull())
		.addColumn("updated_at", "timestamp", (col) => col.defaultTo("now()").notNull())
		.addForeignKeyConstraint("medical_facilities_users_FK", ["manager_id"], "users", [
			"id",
		])
		.addForeignKeyConstraint(
			"medical_facilities_type_FK",
			["facility_type_id"],
			"facility_types",
			["id"],
		)
		.ifNotExists()
		.execute();

	await db.schema
		.createIndex("medical_facility_location_gix")
		.on("medical_facilities")
		.column("location")
		.using("gist")
		.ifNotExists()
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("medical_facilities").execute();
}
