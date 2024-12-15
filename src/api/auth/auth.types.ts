import { isNotADate, tryParseDate } from "@/common/helpers";
import type { AccessToken } from "@/common/models/accessToken";
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
	if (isNotADate(result.createdAt)) {
		result.createdAt = tryParseDate(result.createdAt)!;
	}
	if (isNotADate(result.expiresAt)) {
		result.expiresAt = tryParseDate(result.expiresAt)!;
	}
	if (result.lastUsedAt && isNotADate(result.lastUsedAt)) {
		result.lastUsedAt = tryParseDate(result.lastUsedAt);
	}
	return result;
}

export type NewAccessToken = string;
