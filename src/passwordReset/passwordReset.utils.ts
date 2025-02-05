import { createHmac } from "node:crypto";
import signed from "signed";
import AppError from "src/common/models/appError";
import { env } from "src/common/utils/envConfig";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { generateRandomString } from "src/common/utils/hashing";
import { passwordResetRoutes } from "./passwordReset.router";
import type { PasswordReset } from "./passwordReset.types";

export const passwordResetUrlSignature = signed({
	secret: env.PASSWORD_RESET_HMAC_SECRET,
	ttl: env.PASSWORD_RESET_CODE_EXPIRATION * 60, //  in seconds
});
export function generatePasswordResetToken(emailOrPhoneNo: string): PasswordReset {
	const token = generateRandomString(32, "hex");
	const expiresAt = new Date(
		Date.now() + env.PASSWORD_RESET_CODE_EXPIRATION * 60 * 1000,
	);
	const hash = generateHash({ token, emailOrPhoneNo, expiresAt });
	return { expiresAt, issuedFor: emailOrPhoneNo, token, hash };
}
export async function validatePasswordResetToken(
	token: string,
): Promise<PasswordReset> {
	const result = await getAppCtx().passwordResetRepository.find(token);
	if (!result) {
		return Promise.reject(AppError.INVALID_PASSWORD_RESET());
	}
	const { expiresAt, hash, issuedFor } = result;

	if (Date.now() > expiresAt.getTime()) {
		await getAppCtx().passwordResetRepository.delete(token);
		return Promise.reject(AppError.INVALID_PASSWORD_RESET());
	}

	const calculatedHmac = generateHash({ expiresAt, emailOrPhoneNo: issuedFor, token });

	if (calculatedHmac !== hash) {
		return Promise.reject(AppError.INVALID_PASSWORD_RESET());
	}
	// the code is valid and used so we delete it
	await getAppCtx().passwordResetRepository.delete(token);
	return result;
}
function generateHash(params: {
	token: string;
	emailOrPhoneNo: string;
	expiresAt: Date;
}) {
	const message = [
		params.token,
		params.emailOrPhoneNo,
		params.expiresAt.getTime(),
	].join("|");
	return createHmac("sha256", env.PASSWORD_RESET_HMAC_SECRET)
		.update(message)
		.digest("hex");
}

export function generatePasswordResetLink(id: string) {
	const url = `${env.FRONT_END_URL}${passwordResetRoutes.resetPassword(id)}`;
	return passwordResetUrlSignature.sign(url, { method: ["get", "post"] });
}
