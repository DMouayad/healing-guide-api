import { DBAuthTokensRepository } from "@/api/auth/authTokens.repository";
import { MailGunEmailNotifier } from "@/api/mailNotifier/mailGunEmailNotifier";
import { DBUserRepository } from "@/api/user/user.repository";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
	mailNotifier: new MailGunEmailNotifier(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
