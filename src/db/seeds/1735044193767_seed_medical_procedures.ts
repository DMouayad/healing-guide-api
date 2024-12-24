import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const items = [
		{ name: "Angioplasty" },
		{ name: "Appendectomy" },
		{ name: "Breast biopsy" },
		{ name: "Cardiac Catheterization" },
		{ name: "Cardiac Stents" },
		{ name: "Cesarean section" },
		{ name: "Dilation and curettage" },
		{ name: "Liver Transplant" },
		{ name: "Mastectomy" },
		{ name: "Prostatectomy" },
		{ name: "X-Ray" },
	];
	await db.insertInto("medical_procedures").values(items).execute();
}
