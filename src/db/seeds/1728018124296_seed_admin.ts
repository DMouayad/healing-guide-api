import { prepareUserToInsertWithKysely } from "@api/user/user.model";
import { createAdminUser } from "@common/factories/userFactory";
import { env } from "@common/utils/envConfig";
import { sha256 } from "@common/utils/hashing";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const user = await createAdminUser({
		userProps: {
			email: env.ADMIN_EMAIL,
			phoneNumber: env.ADMIN_PHONE,
			passwordHash: sha256(env.ADMIN_PASSWORD),
			activated: true,
		},
		hasVerifiedEmail: true,
		hasVerifiedPhoneNo: true,
	});

	await db.insertInto("users").values(prepareUserToInsertWithKysely(user)).execute();
}
