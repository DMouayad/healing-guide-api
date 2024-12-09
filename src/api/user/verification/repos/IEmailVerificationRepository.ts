import type { IUser } from "@/interfaces/IUser";
import type { VerificationCode } from "../types";

export interface IEmailVerificationRepository {
	storeEmailVerification(
		emailVerification: VerificationCode,
	): Promise<VerificationCode>;
	findBy(user: IUser): Promise<VerificationCode | undefined>;
}
