import type { Kysely } from "kysely";
import { createAdminUser } from "src/common/factories/userFactory";
import { env } from "src/common/utils/envConfig";
import { sha256 } from "src/common/utils/hashing";
import { prepareUserToInsertWithKysely } from "src/rest-api/user/user.model";

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
