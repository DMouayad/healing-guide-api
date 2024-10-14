import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IMailService } from "@/interfaces/IMailService";
import type { IUserRepository } from "@/interfaces/IUserRepository";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly mailService: IMailService;
};
