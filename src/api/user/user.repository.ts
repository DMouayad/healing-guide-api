import type { RequireAtLeastOne } from "@/common/types";
import { db } from "@/db";
import type { IUserRepository, UpdateUserParams } from "@/interfaces/IUserRepository";
import { DBUser } from "./user.model";

export class DBUserRepository implements IUserRepository<DBUser> {
	async find(id: string): Promise<DBUser | undefined> {
		const query = db.selectFrom("users").selectAll("users").where("id", "=", id);
		return query.executeTakeFirst().then((result) => DBUser.fromQueryResult(result));
	}

	async delete(user: DBUser): Promise<DBUser | undefined> {
		return db
			.deleteFrom("users")
			.where("id", "=", user.id)
			.returningAll()
			.executeTakeFirst()
			.then((result) => DBUser.fromQueryResult(result));
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
		return query
			.returningAll()
			.executeTakeFirst()
			.then((result) => DBUser.fromQueryResult(result));
	}
}
