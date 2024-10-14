import type { IUser } from "@/interfaces/IUser";
import signed from "signed";
import { env } from "./envConfig";

export function createVerifyEmailURL(user: IUser) {
	const url = `${env.APP_URL}/api/${env.API_VERSION}/users/email/verify/${user.id}`;
	return getUserSignature(user).sign(url, { method: "get" });
}

export function getUserSignature(user: IUser) {
	return signed({
		secret: user.passwordHash,
		ttl: 60 * 60, // 3600s = 1h
	});
}
