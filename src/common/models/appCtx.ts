import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";

export type AppCtx = {
	readonly UserRepository: IUserRepository;
	readonly AuthTokensRepository: IAuthTokensRepository;
};
