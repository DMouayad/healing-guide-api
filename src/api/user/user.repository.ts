import type { RequireAtLeastOne } from "@/common/types";
import { db } from "@/db";
import { addRoleToUser } from "@/db/kyselyRelations";
import type { IUserRepository, UpdateUserParams } from "@/interfaces/IUserRepository";
import { DBUser } from "./user.model";

export class DBUserRepository implements IUserRepository<DBUser> {
	async find(id: string): Promise<DBUser | undefined> {
		const query = db
			.selectFrom("users")
			.selectAll("users")
			.where("id", "=", id)
			.select(({ ref }) => addRoleToUser(ref("role_id")).as("role"));
		return DBUser.fromQueryResult(await query.executeTakeFirst());
	}

	async delete(user: DBUser): Promise<DBUser | undefined> {
		const queryResult = await db.deleteFrom("users").where("id", "=", user.id).returningAll().executeTakeFirst();
		if (queryResult) {
			return DBUser.fromQueryResult({ ...queryResult, role: user.role });
		}
	}

	async update(
		user: DBUser,
		{ fullName, email, phoneNumber, activated }: RequireAtLeastOne<UpdateUserParams>,
	): Promise<DBUser | undefined> {
		const query = db.updateTable("users").where("users.id", "=", user.id);
		if (fullName) {
			query.set("full_name", fullName);
		}
		if (email) {
			query.set("email", email);
		}
		if (phoneNumber) {
			query.set("phone_number", phoneNumber);
		}
		if (activated) {
			query.set("activated", activated);
		}
		const queryResult = await query.returningAll().executeTakeFirst();
		if (queryResult) {
			return DBUser.fromQueryResult({ ...queryResult, role: user.role });
		}
	}
}
