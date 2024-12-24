import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const items = [
		{ name: "Emergency Department (ED)" },
		{ name: "Cardiology" },
		{ name: "Neurology" },
		{ name: "Pediatrics" },
		{ name: "Obstetrics and Gynecology" },
		{ name: "Oncology" },
		{ name: "Orthopedics" },
		{ name: "Radiology" },
		{ name: "Pathology" },
		{ name: "General Surgery" },
		{ name: "Urology" },
		{ name: "Dermatology" },
		{ name: "Gastroenterology" },
		{ name: "Nephrology" },
		{ name: "Pulmonology" },
		{ name: "Psychiatry" },
		{ name: "Anesthesiology" },
		{ name: "Intensive Care Unit (ICU)" },
		{ name: "Infectious Diseases" },
		{ name: "Ophthalmology" },
		{ name: "ENT (Otorhinolaryngology)" },
		{ name: "Hematology" },
		{ name: "Physical Medicine and Rehab" },
	];

	await db.insertInto("medical_departments").values(items).execute();
}
