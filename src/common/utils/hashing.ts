import { createHash, randomBytes } from "node:crypto";
import type { CreateUserDTO } from "@/interfaces/IUser";
import bcrypt from "bcryptjs";
export function sha256(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

export function generateRandomString(length: number) {
	return randomBytes(length).toString("base64");
}

export async function getUserPasswordHash(dto: CreateUserDTO) {
	const password = dto.email + dto.password;

	return bcrypt.genSalt(14).then((salt) => bcrypt.hash(password, salt));
}
