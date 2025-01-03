import { DBAuthTokensRepository } from "@/api/auth/authTokens.repository";
import { DBLanguageRepository } from "@/api/languages/LanguageRepository";
import { DBMedicalConditionsRepository } from "@/api/medicalConditions/MedicalConditionsRepository";
import { DBMedicalDepartmentsRepository } from "@/api/medicalDepartments/MedicalDepartmentsRepository";
import { DBMedicalProceduresRepository } from "@/api/medicalProcedures/MedicalProceduresRepository";
import { DBMedicalSpecialtiesRepository } from "@/api/medicalSpecialties/MedicalSpecialtiesRepository";
import { DBPhysicianRepository } from "@/api/physician/physician.repository";
import { DBPhysicianFeedbackRepository } from "@/api/physicianFeedback/PhysicianFeedbackRepository";
import { DBUserRepository } from "@/api/user/user.repository";
import { FakeSmsNotifier } from "@/notifications/services/FakeSmsNotifier";
import { NodemailerEmailNotifier } from "@/notifications/services/NodemailerEmailNotifier";
import { DBOtpRepository } from "@/otp/otpRepository";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userRepository: new DBUserRepository(),
	otpRepository: new DBOtpRepository(),
	authTokensRepository: new DBAuthTokensRepository(),
	mailNotifier: new NodemailerEmailNotifier(),
	smsNotifier: new FakeSmsNotifier(),
	medicalDepartmentsRepository: new DBMedicalDepartmentsRepository(),
	medicalSpecialtiesRepository: new DBMedicalSpecialtiesRepository(),
	medicalProceduresRepository: new DBMedicalProceduresRepository(),
	medicalConditionsRepository: new DBMedicalConditionsRepository(),
	physicianFeedbackRepository: new DBPhysicianFeedbackRepository(),
	physicianRepository: new DBPhysicianRepository(),
	languagesRepository: new DBLanguageRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
