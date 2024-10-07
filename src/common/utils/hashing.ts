import { createHash, randomBytes } from "node:crypto";

export function sha256(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

export function generateRandomString(length: number) {
	return randomBytes(length).toString("base64");
}
