import { seed as rolesSeed } from "./seeds/1728017019540_seed_roles";
import { seed as adminUserSeed } from "./seeds/1728018124296_seed_admin";

import { prepareUserToInsertWithKysely } from "@/api/user/user.model";
import { userFactory } from "@/common/factories/userFactory";
import { APP_ROLES, type Role } from "@/common/types";
import { logger } from "@/common/utils/logger";
import { db } from ".";

export async function seedAdmin(): Promise<void> {
	return adminUserSeed(db)
		.then((_) => logger.info("SEED SUCCESS(admin-user)"))
		.catch((error) => {
			logger.error(`SEED FAILED(admin-user): ${error}`);
		});
}
export async function seedAppRoles(): Promise<void> {
	return rolesSeed(db)
		.then((_) => logger.info("SEED SUCCESS(roles)"))
		.catch((error) => {
			logger.error(`SEED FAILED(roles): ${error}`);
		});
}
export async function seedRandomUsers({
	count,
	role,
}: { count: number; role?: Role }): Promise<void> {
	const users = userFactory
		.createMany(count, {
			userProps: { role: role ?? APP_ROLES.guest },
			generateRandomPassword: true,
		})
		.map((item) => prepareUserToInsertWithKysely(item));

	await db.insertInto("users").values(users).execute();
}
