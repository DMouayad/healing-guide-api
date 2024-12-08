import { DBAuthTokensRepository } from "@/api/auth/authTokens.repository";
import { DBUserRepository } from "@/api/user/user.repository";
import { DBEmailVerificationRepo } from "@/api/user/verification/repos/DBEmailVerificationRepo";
import { NodemailerEmailNotifier } from "@mail/services/NodemailerEmailNotifier";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
	mailNotifier: new NodemailerEmailNotifier(),
	emailVerificationRepo: new DBEmailVerificationRepo(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
