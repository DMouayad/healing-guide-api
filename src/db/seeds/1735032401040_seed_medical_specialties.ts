import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const items = [
		{ name: "Dentistry" },
		{ name: "Cardiology" },
		{ name: "Neurology" },
		{ name: "Pediatrics" },
		{ name: "Oncology" },
		{ name: "Orthopedics" },
		{ name: "Radiology" },
	];
	await db.insertInto("medical_specialties").values(items).execute();
}
