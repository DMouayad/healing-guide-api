import type { IFacilityResourceCategoriesRepository } from "@/api/facilityResourceCategory/FacilityResourceCategoriesRepository";
import type { IFacilityTypesRepository } from "@/api/facilityTypes/facilityTypesRepository";
import type { IFeedbackRepository } from "@/api/feedbacks/FeedbackRepository";
import type { IReceivedFeedbackRepository } from "@/api/feedbacks/ReceivedFeedbackRepository";
import type { IFacilityResourcesRepository } from "@/api/medicalFacility/facilityResources.repository";
import type { IMedicalFacilityRepository } from "@/api/medicalFacility/medicalFacility.repository";
import type { IReviewsRepository } from "@/api/reviews/IReviewsRepository";
import type { IMailNotifier } from "@/notifications/services/IMailNotifier";
import type { ISmsNotifier } from "@/notifications/services/ISmsNotifier";
import type { IPasswordResetRepository } from "@/passwordReset/passwordReset.repository";
import type { ILanguageRepository } from "@api/languages/LanguageRepository";
import type { IMedicalConditionsRepository } from "@api/medicalConditions/MedicalConditionsRepository";
import type { IMedicalDepartmentsRepository } from "@api/medicalDepartments/MedicalDepartmentsRepository";
import type { IMedicalProceduresRepository } from "@api/medicalProcedures/MedicalProceduresRepository";
import type { IMedicalSpecialtiesRepository } from "@api/medicalSpecialties/MedicalSpecialtiesRepository";
import type { IPhysicianRepository } from "@api/physician/physician.repository";
import type { IAuthTokensRepository } from "@interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@interfaces/IUserRepository";
import type { IOtpRepository } from "@otp/otpRepository";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly otpRepository: IOtpRepository;
	readonly mailNotifier: IMailNotifier;
	readonly smsNotifier: ISmsNotifier;
	readonly medicalDepartmentsRepository: IMedicalDepartmentsRepository;
	readonly medicalSpecialtiesRepository: IMedicalSpecialtiesRepository;
	readonly medicalProceduresRepository: IMedicalProceduresRepository;
	readonly physicianFeedbackRepository: IFeedbackRepository;
	readonly medicalConditionsRepository: IMedicalConditionsRepository;
	readonly physicianRepository: IPhysicianRepository;
	readonly physicianReceivedFeedbackRepository: IReceivedFeedbackRepository;
	readonly languagesRepository: ILanguageRepository;
	readonly physicianReviewsRepository: IReviewsRepository;
	readonly passwordResetRepository: IPasswordResetRepository;
	readonly facilityResourceCategoryRepository: IFacilityResourceCategoriesRepository;
	readonly facilityTypeRepository: IFacilityTypesRepository;
	readonly facilityReceivedFeedbackRepository: IReceivedFeedbackRepository;
	readonly facilityFeedbackRepository: IFeedbackRepository;
	readonly facilityReviewsRepository: IReviewsRepository;
	readonly facilityResourcesRepository: IFacilityResourcesRepository;
	readonly medicalFacilityRepository: IMedicalFacilityRepository;
};
