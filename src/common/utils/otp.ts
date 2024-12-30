import { randomInt } from "node:crypto";
import type { IUser } from "@/interfaces/IUser";
import AppError from "../models/appError";
import type { UserTOTP } from "../types";
import { dateIsPast, getExpiresAt } from "./dateHelpers";
import { env } from "./envConfig";

export function generateUserTOTP(
	user: IUser,
	length: number,
	expirationInMinutes: number,
): UserTOTP {
	return {
		user,
		code: generateOTP(length),
		expiresAt: getExpiresAt(expirationInMinutes),
	};
}
export function generateOTP(
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

export async function validateOTP(
	otp: string,
	storedOtp: { code: string; expiresAt: Date } | undefined,
): Promise<void> {
	if (!storedOtp || storedOtp?.code !== otp) {
		return Promise.reject(AppError.FORBIDDEN());
	}
	if (dateIsPast(storedOtp.expiresAt)) {
		return Promise.reject(AppError.EXPIRED_OTP());
	}
}
