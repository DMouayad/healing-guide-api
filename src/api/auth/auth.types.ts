import type { AccessToken } from "@/common/models/accessToken";
import { isNotDate, tryParseDate } from "@/common/utils/dateHelpers";
import type { IUser } from "@/interfaces/IUser";
import { objectToCamel } from "ts-case-convert";

export type KyselyQueryAccessToken = {
	id: number;
	user_id: number;
	hash: string;
	created_at: Date;
	expires_at: Date;
	fingerprint: string | null;
	last_used_at: Date | null;
};
export function accessTokenFromKyselyQuery(token: KyselyQueryAccessToken): AccessToken {
	const result = objectToCamel(token);
	// sometimes the returned 'Date' fields from Kysely is of type `string`
	// so we check and convert if necessary
	if (isNotDate(result.createdAt)) {
		result.createdAt = tryParseDate(result.createdAt)!;
	}
	if (isNotDate(result.expiresAt)) {
		result.expiresAt = tryParseDate(result.expiresAt)!;
	}
	if (result.lastUsedAt && isNotDate(result.lastUsedAt)) {
		result.lastUsedAt = tryParseDate(result.lastUsedAt);
	}
	return result;
}

export type NewAccessToken = string;
export type IdentityConfirmationCode = {
	user: IUser;
	expiresAt: Date;
	code: string;
};
