import type { Expression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { db } from ".";

export function addRoleToUser(roleId: Expression<number>) {
	return jsonObjectFrom(db.selectFrom("roles").select(["id as roleId", "slug"]).where("id", "=", roleId)).$notNull();
}
export function addSelectUser(userId: Expression<number>) {
	return jsonObjectFrom(db.selectFrom("users").where("id", "=", userId).selectAll()).$notNull();
}
