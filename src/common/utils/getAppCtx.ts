import { DBFacilityTypesRepository } from "@/api/facilityTypes/facilityTypesRepository";
import {
	DBFacilityFeedbackRepository,
	DBPhysicianFeedbackRepository,
} from "@/api/feedbacks/FeedbackRepository";
import {
	DBFacilityReceivedFeedbackRepository,
	DBPhysicianReceivedFeedbackRepository,
} from "@/api/feedbacks/ReceivedFeedbackRepository";
import { DBFacilityResourcesRepository } from "@/api/medicalFacility/facilityResources.repository";
import { DBFacilityReviewsRepository } from "@/api/medicalFacility/facilityReviewsRepository";
import { DBMedicalFacilityRepository } from "@/api/medicalFacility/medicalFacility.repository";
import { DBPatientVisitorInfoCategoriesRepository } from "@/api/patientVisitorInfo/PatientVisitorInfoCategoriesRepository";
import { FakeSmsNotifier } from "@/notifications/services/FakeSmsNotifier";
import { NodemailerEmailNotifier } from "@/notifications/services/NodemailerEmailNotifier";
import { DBPasswordResetRepository } from "@/passwordReset/passwordReset.repository";
import { DBAuthTokensRepository } from "@api/auth/authTokens.repository";
import { DBLanguageRepository } from "@api/languages/LanguageRepository";
import { DBMedicalConditionsRepository } from "@api/medicalConditions/MedicalConditionsRepository";
import { DBMedicalDepartmentsRepository } from "@api/medicalDepartments/MedicalDepartmentsRepository";
import { DBMedicalProceduresRepository } from "@api/medicalProcedures/MedicalProceduresRepository";
import { DBMedicalSpecialtiesRepository } from "@api/medicalSpecialties/MedicalSpecialtiesRepository";
import { DBPhysicianRepository } from "@api/physician/physician.repository";
import { DBPhysicianReviewsRepository } from "@api/physician/physicianReviewsRepository";
import { DBUserRepository } from "@api/user/user.repository";
import { DBOtpRepository } from "@otp/otpRepository";
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
	physicianReceivedFeedbackRepository: new DBPhysicianReceivedFeedbackRepository(),
	physicianReviewsRepository: new DBPhysicianReviewsRepository(),
	passwordResetRepository: new DBPasswordResetRepository(),
	patientVisitorInfoCategoriesRepository:
		new DBPatientVisitorInfoCategoriesRepository(),
	facilityTypeRepository: new DBFacilityTypesRepository(),
	facilityReceivedFeedbackRepository: new DBFacilityReceivedFeedbackRepository(),
	facilityFeedbackRepository: new DBFacilityFeedbackRepository(),
	facilityReviewsRepository: new DBFacilityReviewsRepository(),
	facilityResourcesRepository: new DBFacilityResourcesRepository(),
	medicalFacilityRepository: new DBMedicalFacilityRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
