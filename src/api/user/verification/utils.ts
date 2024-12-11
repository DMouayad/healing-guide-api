import AppError from "@/common/models/appError";
import { env } from "@/common/utils/envConfig";
import { generateOTP } from "@/common/utils/otpGenerator";
import type { IUser } from "@/interfaces/IUser";
import type { VerificationCode } from "./types";

export async function validateVerificationCode(
	code: string,
	storedVerification: VerificationCode | undefined,
): Promise<void> {
	if (!storedVerification || storedVerification?.code !== code) {
		throw AppError.FORBIDDEN();
	}
	if (hasExpired(storedVerification.expiresAt)) {
		throw AppError.EXPIRED_VERIFICATION_CODE();
	}
}

function hasExpired(expiresAt: Date): boolean {
	return expiresAt.valueOf() < Date.now();
}

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
function getExpiresAt(expirationInMinutes: number) {
	const createdAt = new Date();
	const expiresAt = new Date();
	expiresAt.setTime(createdAt.getTime() + expirationInMinutes * 60000);
	return expiresAt;
}
