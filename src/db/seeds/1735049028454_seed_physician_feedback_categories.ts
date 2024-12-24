import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const items = [{ name: "Provider Feedback" }, { name: "Office and Staff Feedback" }];
	await db.insertInto("physician_feedback_categories").values(items).execute();
}
