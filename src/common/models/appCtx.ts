import type { IMailNotifier } from "@/api/mailNotifier/IMailNotifier";
import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly mailNotifier: IMailNotifier;
};
