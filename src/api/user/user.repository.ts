import { db } from "@/db";
import type { IUser } from "@/interfaces/IUser";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import { objectToCamel } from "ts-case-convert";

export class DBUserRepository implements IUserRepository {
	async updateUserById(
		id: string,
		fullName?: string,
		email?: string,
		phoneNumber?: string,
	): Promise<IUser | undefined> {
		const query = db.updateTable("users").where("users.id", "=", id);
		if (fullName) {
			query.set("full_name", fullName);
		}
		if (email) {
			query.set("email", email);
		}
		if (phoneNumber) {
			query.set("phone_number", phoneNumber);
		}
		const user = await query.returningAll().executeTakeFirst();
		if (user) {
			return objectToCamel(user);
		}
	}
	async deleteUserById(id: string): Promise<IUser | undefined> {
		const user = await db.deleteFrom("users").where("id", "=", id).returningAll().executeTakeFirst();
		if (user) {
			return objectToCamel(user);
		}
	}
	async getUserById(id: string): Promise<IUser | undefined> {
		const user = await db.selectFrom("users").selectAll("users").where("id", "=", id).executeTakeFirst();
		if (user) {
			return objectToCamel(user);
		}
	}
}
