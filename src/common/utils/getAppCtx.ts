import { FakeSmsNotifier } from "src/notifications/services/FakeSmsNotifier";
import { NodemailerEmailNotifier } from "src/notifications/services/NodemailerEmailNotifier";
import { DBOtpRepository } from "src/otp/otpRepository";
import { DBPasswordResetRepository } from "src/passwordReset/passwordReset.repository";
import { DBAuthTokensRepository } from "src/rest-api/auth/authTokens.repository";
import { DBFacilityTypesRepository } from "src/rest-api/facilityTypes/facilityTypesRepository";
import {
	DBFacilityFeedbackRepository,
	DBPhysicianFeedbackRepository,
} from "src/rest-api/feedbacks/FeedbackRepository";
import {
	DBFacilityReceivedFeedbackRepository,
	DBPhysicianReceivedFeedbackRepository,
} from "src/rest-api/feedbacks/ReceivedFeedbackRepository";
import { DBLanguageRepository } from "src/rest-api/languages/LanguageRepository";
import { DBMedicalConditionsRepository } from "src/rest-api/medicalConditions/MedicalConditionsRepository";
import { DBMedicalDepartmentsRepository } from "src/rest-api/medicalDepartments/MedicalDepartmentsRepository";
import { DBFacilityReviewsRepository } from "src/rest-api/medicalFacility/facilityReviewsRepository";
import { DBMedicalFacilityRepository } from "src/rest-api/medicalFacility/medicalFacility.repository";
import { DBMedicalProceduresRepository } from "src/rest-api/medicalProcedures/MedicalProceduresRepository";
import { DBMedicalSpecialtiesRepository } from "src/rest-api/medicalSpecialties/MedicalSpecialtiesRepository";
import { DBPatientVisitorResourceCategoriesRepository } from "src/rest-api/patientVisitorResource/PatientVisitorResourceCategoriesRepository";
import { DBPatientVisitorResourceRepository } from "src/rest-api/patientVisitorResource/PatientVisitorResourceRepository";
import { DBPhysicianRepository } from "src/rest-api/physician/physician.repository";
import { DBPhysicianReviewsRepository } from "src/rest-api/physician/physicianReviewsRepository";
import { DBUserRepository } from "src/rest-api/user/user.repository";
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
	patientVisitorResourceCategoriesRepository:
		new DBPatientVisitorResourceCategoriesRepository(),
	facilityTypeRepository: new DBFacilityTypesRepository(),
	facilityReceivedFeedbackRepository: new DBFacilityReceivedFeedbackRepository(),
	facilityFeedbackRepository: new DBFacilityFeedbackRepository(),
	facilityReviewsRepository: new DBFacilityReviewsRepository(),
	patientVisitorResourceRepository: new DBPatientVisitorResourceRepository(),
	medicalFacilityRepository: new DBMedicalFacilityRepository(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
