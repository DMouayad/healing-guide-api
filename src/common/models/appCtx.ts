import type { IIdentityConfirmationCodesRepository } from "@/api/auth/repos/IdentityConfirmationCodesRepository";
import type { ISignupCodesRepository } from "@/api/auth/repos/SignupCodesRepository";
import type { IEmailVerificationCodesRepository } from "@/api/user/verification/repos/IEmailVerificationCodesRepository";
import type { IPhoneVerificationCodesRepository } from "@/api/user/verification/repos/IPhoneVerificationCodesRepository";
import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import type { IMailNotifier } from "@/notifications/services/IMailNotifier";
import type { ISmsNotifier } from "@/notifications/services/ISmsNotifier";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly mailNotifier: IMailNotifier;
	readonly smsNotifier: ISmsNotifier;
	readonly emailVerificationRepo: IEmailVerificationCodesRepository;
	readonly phoneVerificationRepo: IPhoneVerificationCodesRepository;
	readonly identityConfirmationRepo: IIdentityConfirmationCodesRepository;
	readonly signupCodesRepository: ISignupCodesRepository;
};
