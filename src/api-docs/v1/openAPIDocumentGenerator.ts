import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { ZodPaginatedJsonResponse } from "@common/zod/common";
import { registerAuthPaths } from "./auth.openapi";
import { registerMedicalFacilityReviewsPaths } from "./facilityReviews.openapi";
import { registerFacilityTypePaths } from "./facilityTypes.openapi";
import { registerLanguagesPaths } from "./languages.openapi";
import { registerMedicalConditionsPaths } from "./medicalConditions.openapi";
import { registerMedicalDepartmentsPaths } from "./medicalDepartments.openapi";
import { registerMedicalFacilityPaths } from "./medicalFacility.openapi";
import { registerMedicalFacilityFeedbackPaths } from "./medicalFacilityFeedback.openapi";
import { registerMedicalProceduresPaths } from "./medicalProcedures.openapi";
import { registerMedicalSpecialtiesPaths } from "./medicalSpecialties.openapi";
import { registerPasswordResetPaths } from "./passwordReset.openapi";
import { registerPatientVisitorInfoCategoryPaths } from "./patientVisitorInfoCategories.openapi";
import { registerPhysicianPaths } from "./physician.openapi";
import { registerPhysicianFeedbackPaths } from "./physicianFeedback.openapi";
import { registerUserPaths } from "./user.openapi";

const v1Registry = new OpenAPIRegistry();
export const v1BearerAuth = v1Registry.registerComponent(
	"securitySchemes",
	"bearerAuth",
	{
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
	},
);
v1Registry.register("PaginatedJsonResponse", ZodPaginatedJsonResponse);

const v1BaseUrl = "/api/v1";

registerAuthPaths(v1Registry, v1BaseUrl);
registerUserPaths(v1Registry, v1BaseUrl);
registerPasswordResetPaths(v1Registry, v1BaseUrl);
registerMedicalDepartmentsPaths(v1Registry, v1BaseUrl);
registerMedicalSpecialtiesPaths(v1Registry, v1BaseUrl);
registerMedicalProceduresPaths(v1Registry, v1BaseUrl);
registerMedicalConditionsPaths(v1Registry, v1BaseUrl);
registerPhysicianPaths(v1Registry, v1BaseUrl);
registerPhysicianFeedbackPaths(v1Registry, v1BaseUrl);
registerLanguagesPaths(v1Registry, v1BaseUrl);
registerMedicalFacilityPaths(v1Registry, v1BaseUrl);
registerFacilityTypePaths(v1Registry, v1BaseUrl);
registerPatientVisitorInfoCategoryPaths(v1Registry, v1BaseUrl);
registerMedicalFacilityFeedbackPaths(v1Registry, v1BaseUrl);
registerMedicalFacilityReviewsPaths(v1Registry, v1BaseUrl);

export function generateV1OpenAPIDocument() {
	const generator = new OpenApiGeneratorV3(v1Registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}
