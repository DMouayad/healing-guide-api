import type { OpenAPIRegistry, ResponseConfig } from "@asteasolutions/zod-to-openapi";
import type { ExamplesObject } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import type { StatusCodes } from "http-status-codes";
import type ApiResponse from "src/common/models/apiResponse";
import { ZodAppErrorSchema } from "src/common/zod/appError.zod";
import { z } from "zod";

type ResponseSchema = z.ZodTypeAny | typeof ZodAppErrorSchema;

type OpenAPIResponseConfig = {
	schema?: ResponseSchema;
	description: string;
	statusCode: StatusCodes;
	example?: ApiResponse;
	examples?: ExamplesObject;
};

function schemaWrapper(schema: ResponseSchema) {
	return schema === ZodAppErrorSchema
		? z.object({ error: schema })
		: z.object({ data: schema });
}

function getOpenAPIResponseConfig(config: OpenAPIResponseConfig): ResponseConfig {
	return {
		description: config.description,
		...(config.schema
			? {
					content: {
						"application/json": {
							schema: schemaWrapper(config.schema),
							example: config.example,
							examples: config.examples,
						},
					},
				}
			: {}),
	};
}
export function createApiResponse(config: OpenAPIResponseConfig) {
	return { [config.statusCode]: getOpenAPIResponseConfig(config) };
}

export function createApiResponses(configs: OpenAPIResponseConfig[]) {
	const responses: { [key: string]: ResponseConfig } = {};
	for (const config of configs) {
		responses[config.statusCode] = getOpenAPIResponseConfig(config);
	}
	return responses;
}

export function bearerAuthSecurityComponent(register: OpenAPIRegistry) {
	return register.registerComponent("securitySchemes", "bearerAuth", {
		type: "http",
		scheme: "bearer",
		bearerFormat: "JWT",
	});
}
