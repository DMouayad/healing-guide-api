import { ZodPaginatedJsonResponse } from "@/common/zod/common";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registerAuthPaths } from "./auth.openapi";
import { registerLanguagesPaths } from "./languages.openapi";
import { registerMedicalConditionsPaths } from "./medicalConditions.openapi";
import { registerMedicalDepartmentsPaths } from "./medicalDepartments.openapi";
import { registerMedicalProceduresPaths } from "./medicalProcedures.openapi";
import { registerMedicalSpecialtiesPaths } from "./medicalSpecialties.openapi";
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
registerMedicalDepartmentsPaths(v1Registry, v1BaseUrl);
registerMedicalSpecialtiesPaths(v1Registry, v1BaseUrl);
registerMedicalProceduresPaths(v1Registry, v1BaseUrl);
registerMedicalConditionsPaths(v1Registry, v1BaseUrl);
registerPhysicianPaths(v1Registry, v1BaseUrl);
registerPhysicianFeedbackPaths(v1Registry, v1BaseUrl);
registerLanguagesPaths(v1Registry, v1BaseUrl);

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
