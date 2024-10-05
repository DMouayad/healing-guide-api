import type { Expression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { db } from ".";

export function addRoleToUser(roleId: Expression<string>) {
	return jsonObjectFrom(db.selectFrom("roles").select(["id as roleId", "slug"]).where("id", "=", roleId));
}
