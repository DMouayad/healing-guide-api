import { AuthTokensRepository } from "@/api/auth/authTokensRepository";
import { UserRepository } from "@/api/user/user.service";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	UserRepository: new UserRepository(),
	AuthTokensRepository: new AuthTokensRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
