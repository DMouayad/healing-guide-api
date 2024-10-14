import { DBAuthTokensRepository } from "@/api/auth/authTokens.repository";
import { DBUserRepository } from "@/api/user/user.repository";
import { MGMailService } from "@/services/mgMailService";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
	mailService: new MGMailService(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
