import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

export function sha256(value: string) {
	return createHash("sha256").update(value).digest("hex");
}
export function generateRandomString(length: number) {
	return randomBytes(length).toString("base64");
}
export async function bcryptHash(str: string) {
	return bcrypt.genSalt(14).then((salt) => bcrypt.hash(str, salt));
}
