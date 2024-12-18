import type { UserTOTP } from "@/common/types";
import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import type { IUser } from "@/interfaces/IUser";
import type { IPhoneVerificationCodesRepository } from "./IPhoneVerificationCodesRepository";

export class FakePhoneVerificationCodesRepo
	implements IPhoneVerificationCodesRepository
{
	fakeVerificationCodeNumber = "1234567";
	async storePhoneVerification(phoneVerification: UserTOTP): Promise<UserTOTP> {
		return phoneVerification;
	}
	async findBy(user: IUser): Promise<UserTOTP | undefined> {
		return {
			user,
			code: "1234567",
			expiresAt: getExpiresAt(env.PHONE_VERIFICATION_CODE_EXPIRATION),
		};
	}
}
