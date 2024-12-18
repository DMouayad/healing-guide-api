import type { UserTOTP } from "@/common/types";
import { db } from "@/db";
import type { IUser } from "@/interfaces/IUser";

export interface IIdentityConfirmationCodesRepository {
	findBy(user: IUser): Promise<UserTOTP | undefined>;
	store(code: UserTOTP): Promise<UserTOTP>;
	deleteAllForUser(user: IUser): Promise<void>;
}
export class DBIdentityConfirmationCodesRepository
	implements IIdentityConfirmationCodesRepository
{
	async deleteAllForUser(user: IUser): Promise<void> {
		return db
			.deleteFrom("identity_confirmation_codes")
			.where("user_id", "=", user.id)
			.execute()
			.then();
	}
	async store(identityConfirmation: UserTOTP): Promise<UserTOTP> {
		return db
			.insertInto("identity_confirmation_codes")
			.columns(["code", "user_id", "expires_at"])
			.values({
				code: identityConfirmation.code,
				user_id: identityConfirmation.user.id,
				expires_at: identityConfirmation.expiresAt,
			})
			.returning(["code", "expires_at"])
			.executeTakeFirstOrThrow()
			.then((res) => {
				return {
					user: identityConfirmation.user,
					expiresAt: res.expires_at,
					code: res.code,
				};
			});
	}
	async findBy(user: IUser): Promise<UserTOTP | undefined> {
		const res = await db
			.selectFrom("identity_confirmation_codes")
			.select(["code", "expires_at"])
			.orderBy("expires_at desc")
			.where("user_id", "=", user.id)
			.executeTakeFirst();
		return res
			? {
					user,
					expiresAt: res.expires_at,
					code: res.code,
				}
			: undefined;
	}
}
