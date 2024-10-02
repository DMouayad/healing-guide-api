import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserService } from "@/interfaces/IUserService";

export type AppCtx = {
	readonly userService: IUserService;
	readonly AuthTokensRepository: IAuthTokensRepository;
};
