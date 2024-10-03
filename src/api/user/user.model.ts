import { APP_ROLES, type Role } from "@/common/types";
import { logger } from "@/common/utils/logger";

import { IUser } from "@/interfaces/IUser";
import { objectToCamel } from "ts-case-convert";

export class DBUser extends IUser {
	public static fromQueryResult(kyselyUser?: KyselyQueryUser): DBUser | undefined {
		if (kyselyUser) {
			const role = kyselyUser.role;
			if (isValidRole(role)) {
				return new DBUser({ ...objectToCamel(kyselyUser), role });
			}
			// if it's invalid
			logger.warn("User does not have a valid role");
		}
	}
}
function isValidRole(roleToCheck: any): roleToCheck is Role {
	if (!roleToCheck) {
		return false;
	}
	const allRoles = Object.values(APP_ROLES).values();
	for (const role of allRoles) {
		if (roleToCheck.roleId === role.roleId && roleToCheck.slug === role.slug) {
			return true;
		}
	}
	return false;
}
export type KyselyQueryUser = {
	id: string;
	created_at: Date;
	activated: boolean;
	email: string;
	email_verified_at: Date | null;
	full_name: string;
	password_hash: string;
	phone_number: string;
	phone_number_verified_at: Date | null;
	role:
		| {
				roleId: string;
				slug: string;
		  }
		| null
		| undefined;
};
