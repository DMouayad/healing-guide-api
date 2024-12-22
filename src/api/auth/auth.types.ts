import type { AccessToken } from "@/common/models/accessToken";
import type { ObjectValues } from "@/common/types";
import { isNotDate, tryParseDate } from "@/common/utils/dateHelpers";
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

export type SignupCode = {
	username: string;
	email: string | undefined | null;
	phoneNumber: string;
	code: string;
	expiresAt: Date;
};

export type SignupCodeSendingMethod = ObjectValues<typeof SIGNUP_CODE_SENDING_METHODS>;

export const SIGNUP_CODE_SENDING_METHODS = {
	sms: "SMS",
	mail: "MAIL",
} as const;
