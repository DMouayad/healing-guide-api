import { DBAuthTokensRepository } from "@/api/auth/authTokens.databaseRepository";
import { UserRepository } from "@/api/user/user.service";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	UserRepository: new UserRepository(),
	AuthTokensRepository: new DBAuthTokensRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
