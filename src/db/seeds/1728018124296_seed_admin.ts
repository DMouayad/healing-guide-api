import { userFactory } from "@/common/factories/userFactory";
import { env } from "@/common/utils/envConfig";
import { sha256 } from "@/common/utils/hashing";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const user = userFactory.createAdmin(
		{
			email: env.ADMIN_EMAIL,
			phoneNumber: env.ADMIN_PHONE,
			passwordHash: sha256(env.ADMIN_PASSWORD),
			activated: true,
		},
		{ hasVerifiedEmail: true, hasVerifiedPhoneNo: true },
	);

	await db
		.insertInto("users")
		.values({
			role_id: user.role.roleId,
			full_name: user.fullName,
			email: user.email,
			phone_number: user.phoneNumber,
			activated: user.activated,
			email_verified_at: user.emailVerifiedAt,
			phone_number_verified_at: user.phoneNumberVerifiedAt,
			password_hash: user.passwordHash,
		})
		.execute();
}
