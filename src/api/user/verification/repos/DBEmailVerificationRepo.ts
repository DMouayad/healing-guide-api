import type { UserTOTP } from "@/common/types";
import { db } from "@/db";
import type { IUser } from "@/interfaces/IUser";
import type { IEmailVerificationRepository } from "./IEmailVerificationRepository";

export class DBEmailVerificationRepo implements IEmailVerificationRepository {
	async findBy(user: IUser): Promise<UserTOTP | undefined> {
		const verification = await db
			.selectFrom("email_verification_codes")
			.where("user_id", "=", user.id)
			.select(["code", "expires_at"])
			.executeTakeFirst();

		return verification
			? {
					user,
					code: verification.code,
					expiresAt: new Date(verification.expires_at),
				}
			: undefined;
	}
	async storeEmailVerification(emailVerification: UserTOTP): Promise<UserTOTP> {
		await clearUserCodes(emailVerification.user.id);
		return db
			.insertInto("email_verification_codes")
			.values({
				code: emailVerification.code,
				expires_at: emailVerification.expiresAt,
				user_id: emailVerification.user.id,
			})
			.execute()
			.then((_) => emailVerification);
	}
}

async function clearUserCodes(userId: number) {
	return await db
		.deleteFrom("email_verification_codes")
		.where("user_id", "=", userId)
		.execute();
}
