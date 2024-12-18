import { getRandomValues } from "node:crypto";
import AppError from "../models/appError";
import { dateIsPast } from "./dateHelpers";

export function generateOTP(length: number) {
	let array = new Uint8Array(length);
	array = getRandomValues(array);

	// Convert the random bytes to a number within the desired range
	const max = 10 ** length - 1;
	const min = 10 ** (length - 1);
	const randomNumber =
		min + (array.reduce((acc, curr) => acc * 256 + curr) % (max - min + 1));

	// Format the number as a 7-digit string, padding with leading zeros if necessary
	return randomNumber.toString().padStart(length, "0");
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
