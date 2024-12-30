import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const langs = [
		{ name: "Arabic" },
		{ name: "English" },
		{ name: "French" },
		{ name: "Turkish" },
	];
	await db.insertInto("languages").values(langs).execute();
}
