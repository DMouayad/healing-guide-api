import type { ILanguageRepository } from "@/api/languages/LanguageRepository";
import type { IMedicalConditionsRepository } from "@/api/medicalConditions/MedicalConditionsRepository";
import type { IMedicalDepartmentsRepository } from "@/api/medicalDepartments/MedicalDepartmentsRepository";
import type { IMedicalProceduresRepository } from "@/api/medicalProcedures/MedicalProceduresRepository";
import type { IMedicalSpecialtiesRepository } from "@/api/medicalSpecialties/MedicalSpecialtiesRepository";
import type { IPhysicianRepository } from "@/api/physician/physician.repository";
import type { IPhysicianFeedbackRepository } from "@/api/physicianFeedback/PhysicianFeedbackRepository";
import type { IAuthTokensRepository } from "@/interfaces/IAuthTokensRepository";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import type { IMailNotifier } from "@/notifications/services/IMailNotifier";
import type { ISmsNotifier } from "@/notifications/services/ISmsNotifier";
import type { IOtpRepository } from "@/otp/otpRepository";

export type AppCtx = {
	readonly userRepository: IUserRepository;
	readonly authTokensRepository: IAuthTokensRepository;
	readonly otpRepository: IOtpRepository;
	readonly mailNotifier: IMailNotifier;
	readonly smsNotifier: ISmsNotifier;
	readonly medicalDepartmentsRepository: IMedicalDepartmentsRepository;
	readonly medicalSpecialtiesRepository: IMedicalSpecialtiesRepository;
	readonly medicalProceduresRepository: IMedicalProceduresRepository;
	readonly physicianFeedbackRepository: IPhysicianFeedbackRepository;
	readonly medicalConditionsRepository: IMedicalConditionsRepository;
	readonly physicianRepository: IPhysicianRepository;
	readonly languagesRepository: ILanguageRepository;
};
