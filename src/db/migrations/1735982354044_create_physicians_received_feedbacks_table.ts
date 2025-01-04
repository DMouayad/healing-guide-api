import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("physicians_received_feedbacks")
		.addColumn("physician_id", "int4", (cb) => cb.notNull())
		.addColumn("user_id", "int4", (cb) => cb.notNull())
		.addColumn("question_id", "int4", (cb) => cb.notNull())
		.addColumn("response", "boolean", (cb) => cb.notNull())
		.addForeignKeyConstraint(
			"physicians_received_feedbacks_users_FK",
			["user_id"],
			"users",
			["id"],
		)
		.addForeignKeyConstraint(
			"physicians_received_feedbacks_physicians_FK",
			["physician_id"],
			"physicians",
			["id"],
		)
		.addForeignKeyConstraint(
			"physicians_received_feedbacks_physician_feedback_questions_FK",
			["question_id"],
			"physician_feedback_questions",
			["id"],
		)
		.addUniqueConstraint("physicians_received_feedbacks_unique", [
			"physician_id",
			"user_id",
			"question_id",
		])
		.ifNotExists()

		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("physicians_received_feedbacks").ifExists().execute();
}
