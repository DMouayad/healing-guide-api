import type { IIdentityConfirmationRepository } from "@/api/auth/repos/IdentityConfirmationRepository";
import type { IEmailVerificationRepository } from "@/api/user/verification/repos/IEmailVerificationRepository";
import type { IPhoneVerificationRepository } from "@/api/user/verification/repos/IPhoneVerificationRepository";
import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import type { IMailNotifier } from "@/notifications/services/IMailNotifier";
import type { ISmsNotifier } from "@/notifications/services/ISmsNotifier";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly mailNotifier: IMailNotifier;
	readonly smsNotifier: ISmsNotifier;
	readonly emailVerificationRepo: IEmailVerificationRepository;
	readonly phoneVerificationRepo: IPhoneVerificationRepository;
	readonly identityConfirmationRepo: IIdentityConfirmationRepository;
};
