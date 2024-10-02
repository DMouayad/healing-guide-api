import { AuthTokensRepository } from "@/api/auth/AuthTokensRepository";
import { UserService } from "@/api/user/user.service";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userService: new UserService(),
	AuthTokensRepository: new AuthTokensRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
