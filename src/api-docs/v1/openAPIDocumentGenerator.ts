import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
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

const v1BaseUrl = "/api/v1";
registerUserPaths(v1Registry, v1BaseUrl);

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
