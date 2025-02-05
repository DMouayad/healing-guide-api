import { createHmac, randomInt } from "node:crypto";
import AppError from "src/common/models/appError";
import type { Role } from "src/common/types";
import { env } from "src/common/utils/envConfig";
import { getAppCtx } from "src/common/utils/getAppCtx";
import type { IUser } from "src/interfaces/IUser";
import { getSignupCodeUniqueIdentifier } from "src/rest-api/auth/utils";
import {
	type CreateOtpDTO,
	type OTPWithCode,
	OTP_PURPOSES,
	type OtpPurpose,
} from "./otp.types";

export function generateOTP(dto: CreateOtpDTO): OTPWithCode {
	const code = generateRandomCode(dto.length, otpHasLetters(dto.purpose));
	const expiresAt = new Date(Date.now() + dto.expirationInMinutes * 60 * 1000);
	const hash = generateHmac({
		code,
		expiresAt,
		issuedFor: dto.issuedFor,
		purpose: dto.purpose,
		secret: dto.secret,
	});
	return { expiresAt, hash, issuedFor: dto.issuedFor, purpose: dto.purpose, code };
}
function generateRandomCode(
	length: number = env.DEFAULT_OTP_LENGTH,
	includeLetters = false,
) {
	let numDigits = length;
	let numLetters = 0;

	if (includeLetters) {
		numDigits = Math.floor(length * 0.8); // 80% digits
		numLetters = length - numDigits; // Remaining 20% letters
	}

	let otp = "";
	const digits = "0123456789";
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Only uppercase letters

	// Add Digits
	for (let i = 0; i < numDigits; i++) {
		otp += digits.charAt(randomInt(0, digits.length));
	}

	// Add Letters (only if includeLetters is true)
	if (includeLetters) {
		for (let i = 0; i < numLetters; i++) {
			otp += letters.charAt(randomInt(0, letters.length));
		}

		// Shuffle the string to mix digits and letters
		otp = otp
			.split("")
			.sort(() => randomInt(-1, 2))
			.join("");
	}

	return otp;
}
function otpHasLetters(purpose: OtpPurpose): boolean {
	switch (purpose) {
		case OTP_PURPOSES.signupConfirmation:
			return true;
		default:
			return false;
	}
}
function generateHmac(params: {
	code: string;
	issuedFor: string;
	purpose: OtpPurpose;
	expiresAt: Date;
	secret?: string;
}) {
	const message = [
		params.code,
		params.issuedFor,
		params.purpose,
		params.expiresAt.getTime(),
	].join("|");
	return createHmac("sha256", params.secret ?? env.HMAC_SECRET)
		.update(message)
		.digest("hex");
}

export function generateIdentityConfirmationOTP(user: IUser) {
	return generateOTP({
		purpose: OTP_PURPOSES.identityConfirmation,
		issuedFor: user.id.toString(),
		length: env.IDENTITY_CONFIRMATION_CODE_LENGTH,
		expirationInMinutes: env.IDENTITY_CONFIRMATION_CODE_EXPIRATION,
	});
}

export function generateEmailVerificationOTP(user: IUser): OTPWithCode {
	return generateOTP({
		issuedFor: user.id.toString(),
		length: env.EMAIL_VERIFICATION_CODE_LENGTH,
		expirationInMinutes: env.EMAIL_VERIFICATION_CODE_EXPIRATION,
		purpose: OTP_PURPOSES.emailVerification,
	});
}
export function generatePhoneVerificationOTP(user: IUser): OTPWithCode {
	return generateOTP({
		issuedFor: user.id.toString(),
		length: env.PHONE_VERIFICATION_CODE_LENGTH,
		expirationInMinutes: env.PHONE_VERIFICATION_CODE_EXPIRATION,
		purpose: OTP_PURPOSES.phoneVerification,
	});
}

export async function validateEmailVerificationCode(code: string, user: IUser) {
	return validateOTPCode({
		code,
		issuedFor: user.id.toString(),
		purpose: OTP_PURPOSES.emailVerification,
	});
}
export async function validatePhoneVerificationCode(code: string, user: IUser) {
	return validateOTPCode({
		code,
		issuedFor: user.id.toString(),
		purpose: OTP_PURPOSES.phoneVerification,
	});
}
export async function validateSignupCode(params: {
	code: string;
	email?: string | null;
	phoneNumber: string;
	role: Role;
}) {
	return validateOTPCode({
		code: params.code,
		issuedFor: getSignupCodeUniqueIdentifier(params),
		purpose: OTP_PURPOSES.signupConfirmation,
	});
}
export async function validateIdentityConfirmationCode(code: string, user: IUser) {
	return validateOTPCode({
		code,
		issuedFor: user.id.toString(),
		purpose: OTP_PURPOSES.identityConfirmation,
	});
}
async function validateOTPCode(params: {
	code: string;
	issuedFor: string;
	purpose: OtpPurpose;
	secret?: string;
}): Promise<void> {
	const result = await getAppCtx().otpRepository.find(params.issuedFor, params.purpose);

	if (!result) {
		return Promise.reject(AppError.INVALID_OTP());
	}
	const { expiresAt, hash } = result;
	if (Date.now() > expiresAt.getTime()) {
		await getAppCtx().otpRepository.delete(params.issuedFor, params.purpose);
		return Promise.reject(AppError.EXPIRED_OTP());
	}

	const calculatedHmac = generateHmac({ ...params, expiresAt });

	if (calculatedHmac !== hash) {
		return Promise.reject(AppError.INVALID_OTP());
	}
	// the code is valid and used so we delete it
	return getAppCtx().otpRepository.delete(params.issuedFor, params.purpose);
}
