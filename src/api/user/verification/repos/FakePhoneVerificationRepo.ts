import type { IUser } from "@/interfaces/IUser";
import type { VerificationCode } from "../types";
import type { IPhoneVerificationRepository } from "./IPhoneVerificationRepository";

export class FakePhoneVerificationRepo implements IPhoneVerificationRepository {
	fakeVerificationCodeNumber = "1234567";
	async storePhoneVerification(
		phoneVerification: VerificationCode,
	): Promise<VerificationCode> {
		return phoneVerification;
	}
	async findBy(user: IUser): Promise<VerificationCode | undefined> {
		return {
			user,
			code: "1234567",
			expiresAt: new Date(getExpiresAt()),
		};
	}
}
function getExpiresAt() {
	const createdAt = new Date();
	const expiresAt = new Date();
	expiresAt.setTime(createdAt.getTime() + 30 * 60000);
	return expiresAt;
}
