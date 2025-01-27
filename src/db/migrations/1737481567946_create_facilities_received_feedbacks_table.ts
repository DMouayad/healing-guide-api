import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("facilities_received_feedbacks")
		.addColumn("facility_id", "int4", (cb) => cb.notNull())
		.addColumn("user_id", "int4", (cb) => cb.notNull())
		.addColumn("question_id", "int4", (cb) => cb.notNull())
		.addColumn("response", "boolean", (cb) => cb.notNull())
		.addForeignKeyConstraint(
			"facilities_received_feedbacks_users_FK",
			["user_id"],
			"users",
			["id"],
		)
		.addForeignKeyConstraint(
			"facilities_received_feedbacks_medical_facilities_FK",
			["facility_id"],
			"medical_facilities",
			["id"],
		)
		.addForeignKeyConstraint(
			"facilities_received_feedbacks_facility_feedback_questions_FK",
			["question_id"],
			"facility_feedback_questions",
			["id"],
		)
		.addUniqueConstraint("facilities_received_feedbacks_unique", [
			"facility_id",
			"user_id",
			"question_id",
		])
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("facilities_received_feedbacks").ifExists().execute();
}
