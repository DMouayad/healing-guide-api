import { APP_ROLES } from "@/common/types";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const rolesToInsert: { id: number; slug: string }[] = [];
	for (const role of Object.values(APP_ROLES)) {
		rolesToInsert.push({ id: role.roleId, slug: role.slug });
	}
	await db.insertInto("roles").values(rolesToInsert).execute();
}
