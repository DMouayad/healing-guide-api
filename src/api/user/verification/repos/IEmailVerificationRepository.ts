import type { UserTOTP } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export interface IEmailVerificationRepository {
	storeEmailVerification(emailVerification: UserTOTP): Promise<UserTOTP>;
	findBy(user: IUser): Promise<UserTOTP | undefined>;
}
