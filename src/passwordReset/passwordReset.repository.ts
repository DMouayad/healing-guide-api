import { db } from "src/db";
import { objectToCamel } from "ts-case-convert";
import type { PasswordReset } from "./passwordReset.types";

export interface IPasswordResetRepository {
	find(token: string): Promise<PasswordReset | undefined>;
	store(passwordReset: PasswordReset): Promise<PasswordReset>;
	delete(token: string): Promise<void>;
}
export class DBPasswordResetRepository implements IPasswordResetRepository {
	find(token: string): Promise<PasswordReset | undefined> {
		return db
			.selectFrom("password_resets")
			.selectAll()
			.where("token", "=", token)
			.executeTakeFirst()
			.then((res) => (res ? objectToCamel(res) : undefined));
	}
	store(passwordReset: PasswordReset): Promise<PasswordReset> {
		return db
			.insertInto("password_resets")
			.values({
				expires_at: passwordReset.expiresAt,
				token: passwordReset.token,
				hash: passwordReset.hash,
				issued_for: passwordReset.issuedFor,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.then(objectToCamel);
	}
	async delete(token: string): Promise<void> {
		await db.deleteFrom("password_resets").where("token", "=", token).execute();
	}
}
