import { DBAuthTokensRepository } from "@/api/auth/authTokens.repository";
import { DBIdentityConfirmationCodesRepository } from "@/api/auth/repos/IdentityConfirmationCodesRepository";
import { DBSignupCodesRepository } from "@/api/auth/repos/SignupCodesRepository";
import { DBMedicalDepartmentsRepository } from "@/api/medicalDepartments/MedicalDepartmentsRepository";
import { DBMedicalSpecialtiesRepository } from "@/api/medicalSpecialties/MedicalSpecialtiesRepository";
import { DBUserRepository } from "@/api/user/user.repository";
import { DBEmailVerificationRepo } from "@/api/user/verification/repos/DBEmailVerificationCodesRepo";
import { FakePhoneVerificationCodesRepo } from "@/api/user/verification/repos/FakePhoneVerificationCodesRepo";
import { FakeSmsNotifier } from "@/notifications/services/FakeSmsNotifier";
import { NodemailerEmailNotifier } from "@/notifications/services/NodemailerEmailNotifier";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
	mailNotifier: new NodemailerEmailNotifier(),
	smsNotifier: new FakeSmsNotifier(),
	emailVerificationRepo: new DBEmailVerificationRepo(),
	phoneVerificationRepo: new FakePhoneVerificationCodesRepo(),
	identityConfirmationRepo: new DBIdentityConfirmationCodesRepository(),
	signupCodesRepository: new DBSignupCodesRepository(),
	medicalDepartmentsRepository: new DBMedicalDepartmentsRepository(),
	medicalSpecialtiesRepository: new DBMedicalSpecialtiesRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
