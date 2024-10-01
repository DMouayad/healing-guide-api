import type { IAuthTokensService } from "@/interfaces/IAuthTokensService";
import type { IUserService } from "@/interfaces/IUserService";

export type AppCtx = {
	readonly userService: IUserService;
	readonly authTokensService: IAuthTokensService;
};
