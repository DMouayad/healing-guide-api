import type { AccessToken } from "@common/models/accessToken";
import type { ObjectValues } from "@common/types";
import { isNotDate, tryParseDate } from "@common/utils/dateHelpers";
import { commonZodSchemas } from "@common/zod/common";
import { objectToCamel } from "ts-case-convert";
import { z } from "zod";

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

export type SignupCodeSendingMethod = ObjectValues<typeof OTP_SENDING_METHODS>;

export const OTP_SENDING_METHODS = {
	sms: "SMS",
	mail: "MAIL",
} as const;

const ZodRoleObj = z.object({ role: commonZodSchemas.role });
export const ZodSignupCodeViaEmail = z
	.object({
		email: z.string().email(),
		phoneNumber: commonZodSchemas.phoneNumber,
		receiveVia: z.literal(OTP_SENDING_METHODS.mail),
	})
	.merge(ZodRoleObj);

export const ZodSignupCodeViaSMS = z
	.object({
		email: z.string().email().optional(),
		phoneNumber: commonZodSchemas.phoneNumber,
		receiveVia: z.literal(OTP_SENDING_METHODS.sms),
	})
	.merge(ZodRoleObj);

export const ZodCreateSignupCodeDto = ZodSignupCodeViaEmail.or(ZodSignupCodeViaSMS);
export const ZodSignupCode = ZodSignupCodeViaEmail.or(ZodSignupCodeViaSMS);
export type SignupCodeViaEmail = typeof ZodSignupCodeViaEmail._output;
export type SignupCodedViaSMS = typeof ZodSignupCodeViaSMS._output;
export type SignupCode = typeof ZodSignupCode._output;
export type SignupCodeDTO = z.infer<typeof ZodCreateSignupCodeDto>;
