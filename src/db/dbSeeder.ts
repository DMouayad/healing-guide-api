import { seed as rolesSeed } from "./seeds/1728017019540_seed_roles";
import { seed as adminUserSeed } from "./seeds/1728018124296_seed_admin";

import * as userFactory from "src/common/factories/userFactory";
import { APP_ROLES, type Role } from "src/common/types";
import { logger } from "src/common/utils/logger";
import { prepareUserToInsertWithKysely } from "src/rest-api/user/user.model";
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
export async function seedRandomUsers(
	count: number,
	role: Role = APP_ROLES.guest,
): Promise<void> {
	userFactory
		.createMany(count, { userProps: { role: role } })
		.then((users) => users.map(prepareUserToInsertWithKysely))
		.then((users) => db.insertInto("users").values(users).execute());
}
