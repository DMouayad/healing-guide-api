import AppError from "@/common/models/appError";
import { env } from "@/common/utils/envConfig";
import { generateOTP } from "@/common/utils/otpGenerator";
import type { IUser } from "@/interfaces/IUser";
import type { EmailVerification } from "./types";

export async function validateEmailVerificationCode(
	code: string,
	emailVerification: EmailVerification | undefined,
): Promise<void> {
	if (!emailVerification || emailVerification?.code !== code) {
		throw AppError.FORBIDDEN();
	}
	if (hasExpired(emailVerification.expiresAt)) {
		throw AppError.EXPIRED_VERIFICATION_CODE();
	}
}

function hasExpired(expiresAt: Date): boolean {
	return expiresAt.valueOf() < Date.now();
}

export function generateEmailVerification(user: IUser): EmailVerification {
	return {
		user,
		code: generateOTP(env.EMAIL_VERIFICATION_CODE_LENGTH),
		expiresAt: getExpiresAt(),
	};
}
function getExpiresAt() {
	const expiresIn = env.EMAIL_VERIFICATION_CODE_EXPIRATION;
	const createdAt = new Date();
	const expiresAt = new Date();
	expiresAt.setTime(createdAt.getTime() + expiresIn * 60000);
	return expiresAt;
}
