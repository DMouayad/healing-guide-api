import { APP_ROLES, type Role } from "@/common/types";
import { logger } from "@/common/utils/logger";

import { IUser } from "@/interfaces/IUser";
import { objectToCamel } from "ts-case-convert";

export class DBUser extends IUser {
	public static fromQueryResult(kyselyUser?: KyselyQueryUser): DBUser | undefined {
		if (kyselyUser) {
			const role = Object.values(APP_ROLES).find((r) => r.roleId === kyselyUser.role_id.toString());
			if (role) {
				return new DBUser({ ...objectToCamel(kyselyUser), role });
			}
			// if role not found
			logger.warn("User does not have a valid role");
		}
	}
}

export type KyselyQueryUser = {
	id: number;
	role_id: number;
	created_at: Date;
	activated: boolean;
	email: string;
	email_verified_at: Date | null;
	full_name: string;
	password_hash: string;
	phone_number: string;
	phone_number_verified_at: Date | null;
};
