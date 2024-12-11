import { DBAuthTokensRepository } from "@/api/auth/authTokens.repository";
import { DBUserRepository } from "@/api/user/user.repository";
import { DBEmailVerificationRepo } from "@/api/user/verification/repos/DBEmailVerificationRepo";
import { FakePhoneVerificationRepo } from "@/api/user/verification/repos/FakePhoneVerificationRepo";
import { FakeSmsNotifier } from "@/notifications/services/FakeSmsNotifier";
import { NodemailerEmailNotifier } from "@/notifications/services/NodemailerEmailNotifier";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
	mailNotifier: new NodemailerEmailNotifier(),
	smsNotifier: new FakeSmsNotifier(),
	emailVerificationRepo: new DBEmailVerificationRepo(),
	phoneVerificationRepo: new FakePhoneVerificationRepo(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
