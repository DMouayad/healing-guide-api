import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const items = [
		{ name: "Diabetes" },
		{ name: "Arthritis" },
		{ name: "Heart disease" },
		{ name: "Anxiety" },
		{ name: "Abortion" },
		{ name: "Asthma Attack" },
	];
	await db.insertInto("medical_conditions").values(items).execute();
}
