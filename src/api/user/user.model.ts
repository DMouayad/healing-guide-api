import { APP_ROLES } from "@/common/types";
import { isNotDate, tryParseDate } from "@/common/utils/dateHelpers";
import { logger } from "@/common/utils/logger";

import { IUser } from "@/interfaces/IUser";
import { objectToCamel } from "ts-case-convert";

export class DBUser extends IUser {
	public static fromQueryResult(kyselyUser?: KyselyQueryUser): DBUser | undefined {
		if (kyselyUser) {
			const role = Object.values(APP_ROLES).find(
				(r) => r.roleId === kyselyUser.role_id,
			);
			if (role) {
				const userProps = { ...objectToCamel(kyselyUser), role };
				if (isNotDate(userProps.createdAt)) {
					userProps.createdAt = tryParseDate(userProps.createdAt)!;
				}
				if (isNotDate(userProps.emailVerifiedAt)) {
					userProps.emailVerifiedAt = tryParseDate(userProps.emailVerifiedAt);
				}
				if (isNotDate(userProps.phoneNumberVerifiedAt)) {
					userProps.phoneNumberVerifiedAt = tryParseDate(
						userProps.phoneNumberVerifiedAt,
					);
				}
				if (isNotDate(userProps.identityConfirmedAt)) {
					userProps.identityConfirmedAt = tryParseDate(userProps.identityConfirmedAt);
				}
				return new DBUser(userProps);
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
	password_hash: string;
	phone_number: string;
	phone_number_verified_at: Date | null;
	identity_confirmed_at: Date | null;
};

export function prepareUserToInsertWithKysely(user: IUser) {
	return {
		role_id: user.role.roleId,
		email: user.email,
		phone_number: user.phoneNumber,
		activated: user.activated,
		email_verified_at: user.emailVerifiedAt,
		phone_number_verified_at: user.phoneNumberVerifiedAt,
		password_hash: user.passwordHash,
	};
}
