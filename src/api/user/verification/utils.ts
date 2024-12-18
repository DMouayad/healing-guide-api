import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import { generateOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";
import type { VerificationCode } from "./types";

export function generateEmailVerification(user: IUser): VerificationCode {
	return {
		user,
		code: generateOTP(env.EMAIL_VERIFICATION_CODE_LENGTH),
		expiresAt: getExpiresAt(env.EMAIL_VERIFICATION_CODE_EXPIRATION),
	};
}
export function generatePhoneVerification(user: IUser): VerificationCode {
	return {
		user,
		code: generateOTP(env.PHONE_VERIFICATION_CODE_LENGTH),
		expiresAt: getExpiresAt(env.PHONE_VERIFICATION_CODE_EXPIRATION),
	};
}
