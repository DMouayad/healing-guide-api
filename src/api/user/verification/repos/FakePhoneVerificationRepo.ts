import type { UserTOTP } from "@/common/types";
import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import type { IUser } from "@/interfaces/IUser";
import type { IPhoneVerificationRepository } from "./IPhoneVerificationRepository";

export class FakePhoneVerificationRepo implements IPhoneVerificationRepository {
	fakeVerificationCodeNumber = "1234567";
	async storePhoneVerification(userTOTP: UserTOTP): Promise<UserTOTP> {
		return userTOTP;
	}
	async findBy(user: IUser): Promise<UserTOTP | undefined> {
		return {
			user,
			code: "1234567",
			expiresAt: getExpiresAt(env.PHONE_VERIFICATION_CODE_EXPIRATION),
		};
	}
}
