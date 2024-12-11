import type { IUser } from "@/interfaces/IUser";
import type { VerificationCode } from "../types";

export interface IPhoneVerificationRepository {
	storePhoneVerification(
		phoneVerification: VerificationCode,
	): Promise<VerificationCode>;
	findBy(user: IUser): Promise<VerificationCode | undefined>;
}
