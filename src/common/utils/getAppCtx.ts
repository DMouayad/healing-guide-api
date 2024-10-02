import { DBAuthTokensRepository } from "@/api/auth/authTokens.databaseRepository";
import { DBUserRepository } from "@/api/user/user.repository";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
