import type { IEmailVerificationRepository } from "@/api/user/verification/repos/IEmailVerificationRepository";
import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import type { IMailNotifier } from "@mail/services/IMailNotifier";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly mailNotifier: IMailNotifier;
	readonly emailVerificationRepo: IEmailVerificationRepository;
};
