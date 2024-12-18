import type { UserTOTP } from "@/common/types";
import { env } from "@/common/utils/envConfig";
import { generateUserTOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";

export function generateEmailVerificationTOTP(user: IUser): UserTOTP {
	return generateUserTOTP(
		user,
		env.EMAIL_VERIFICATION_CODE_LENGTH,
		env.EMAIL_VERIFICATION_CODE_EXPIRATION,
	);
}
export function generatePhoneVerificationTOTP(user: IUser): UserTOTP {
	return generateUserTOTP(
		user,
		env.PHONE_VERIFICATION_CODE_LENGTH,
		env.PHONE_VERIFICATION_CODE_EXPIRATION,
	);
}
