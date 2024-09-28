import { db } from "@/db";
import type { IUser } from "@/interfaces/IUser";
import type { IUserService } from "@/interfaces/IUserService";

export class UserService implements IUserService {
	async updateUserById(
		id: string,
		fullName?: string,
		email?: string,
		phoneNumber?: string,
	): Promise<IUser | undefined> {
		const query = db.updateTable("users").where("users.id", "=", id);
		if (fullName) {
			query.set("fullName", fullName);
		}
		if (email) {
			query.set("email", email);
		}
		if (phoneNumber) {
			query.set("phoneNumber", phoneNumber);
		}

		return await query.returningAll().executeTakeFirst();
	}
	async deleteUserById(id: string): Promise<IUser | undefined> {
		return await db.deleteFrom("users").where("id", "=", id).returningAll().executeTakeFirst();
	}
	async getUserById(id: string): Promise<IUser | undefined> {
		console.log(id);
		return await db.selectFrom("users").selectAll("users").where("id", "=", id).executeTakeFirst();
	}
}
