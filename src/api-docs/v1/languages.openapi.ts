import { languageRoutes } from "@api/languages/language.router";
import { ZodLanguage } from "@api/languages/language.types";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { commonZodSchemas } from "@common/zod/common";
import { StatusCodes } from "http-status-codes";
import {
	duplicateResourceResponse,
	paginatedJsonResponse,
	unauthenticatedResponse,
	unauthorizedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerLanguagesPaths(registry: OpenAPIRegistry, baseUrl: string) {
	const basePath = baseUrl + languageRoutes.baseRoute;
	registry.register("Language", ZodLanguage);

	registry.registerPath({
		method: "post",
		path: basePath + languageRoutes.add,
		description: "Used to add a new `Language` to the database",
		tags: ["Languages"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: commonZodSchemas.requestBodyWithName,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new `Language` was created",
				schema: ZodLanguage,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Language` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: basePath + languageRoutes.edit("{id}"),
		description: "Used to edit an existing `Language`",
		tags: ["Languages"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: commonZodSchemas.requestBodyWithName,
					},
				},
			},
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success:`Language` was updated",
				schema: ZodLanguage,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Language` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: basePath + languageRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `Language`",
		tags: ["Languages"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: resource was deleted",
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});

	registry.registerPath({
		method: "get",
		path: basePath + languageRoutes.getAll,
		description: "Used to retrieve all stored `Language`s",
		tags: ["Languages"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse("Success: Returns a list of `Language`", ZodLanguage),
		]),
	});
}
