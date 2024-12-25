import type { IIdentityConfirmationCodesRepository } from "@/api/auth/repos/IdentityConfirmationCodesRepository";
import type { ISignupCodesRepository } from "@/api/auth/repos/SignupCodesRepository";
import type { IMedicalConditionsRepository } from "@/api/medicalConditions/MedicalConditionsRepository";
import type { IMedicalDepartmentsRepository } from "@/api/medicalDepartments/MedicalDepartmentsRepository";
import type { IMedicalProceduresRepository } from "@/api/medicalProcedures/MedicalProceduresRepository";
import type { IMedicalSpecialtiesRepository } from "@/api/medicalSpecialties/MedicalSpecialtiesRepository";
import type { IPhysicianFeedbackCategoriesRepository } from "@/api/physicianFeedbackCategories/PhysicianFeedbackCategoriesRepository";
import type { IEmailVerificationCodesRepository } from "@/api/user/verification/repos/IEmailVerificationCodesRepository";
import type { IPhoneVerificationCodesRepository } from "@/api/user/verification/repos/IPhoneVerificationCodesRepository";
import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import type { IMailNotifier } from "@/notifications/services/IMailNotifier";
import type { ISmsNotifier } from "@/notifications/services/ISmsNotifier";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly mailNotifier: IMailNotifier;
	readonly smsNotifier: ISmsNotifier;
	readonly emailVerificationRepo: IEmailVerificationCodesRepository;
	readonly phoneVerificationRepo: IPhoneVerificationCodesRepository;
	readonly identityConfirmationRepo: IIdentityConfirmationCodesRepository;
	readonly signupCodesRepository: ISignupCodesRepository;
	readonly medicalDepartmentsRepository: IMedicalDepartmentsRepository;
	readonly medicalSpecialtiesRepository: IMedicalSpecialtiesRepository;
	readonly medicalProceduresRepository: IMedicalProceduresRepository;
	readonly physicianFeedbackCategoriesRepository: IPhysicianFeedbackCategoriesRepository;
	readonly medicalConditionsRepository: IMedicalConditionsRepository;
};
