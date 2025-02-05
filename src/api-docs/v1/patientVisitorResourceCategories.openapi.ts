import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { commonZodSchemas } from "src/common/zod/common";
import { patientVisitorResourceCategoryRoutes } from "src/rest-api/patientVisitorResource/patientVisitorResourceCategoryRouter";
import {
	PatientVisitorResourceCategorySchema,
	PatientVisitorResourceCategorySchemas,
} from "src/rest-api/patientVisitorResource/types";
import {
	duplicateResourceResponse,
	paginatedJsonResponse,
	unauthenticatedResponse,
	unauthorizedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerPatientVisitorResourceCategoryPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const routes = patientVisitorResourceCategoryRoutes;
	const baseRoute = baseUrl + routes.baseRoute;
	registry.register(
		"PatientVisitorResourceCategory",
		PatientVisitorResourceCategorySchema,
	);

	registry.registerPath({
		method: "post",
		path: baseRoute + routes.create,
		description: "Used to add a new `PatientVisitorResourceCategory` to the database",
		tags: ["Patient-Visitor Resource Category"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: PatientVisitorResourceCategorySchemas.create,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new `PatientVisitorResourceCategory` was created",
				schema: PatientVisitorResourceCategorySchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PatientVisitorResourceCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: baseRoute + routes.update("{id}"),
		description: "Used to edit an existing `PatientVisitorResourceCategory`",
		tags: ["Patient-Visitor Resource Category"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: PatientVisitorResourceCategorySchemas.update,
					},
				},
			},
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success:`PatientVisitorResourceCategory` was updated",
				schema: PatientVisitorResourceCategorySchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PatientVisitorResourceCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: baseRoute + routes.delete("{id}"),
		description:
			"Used by an admin to delete a specific `PatientVisitorResourceCategory`",
		tags: ["Patient-Visitor Resource Category"],
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
		path: baseRoute + routes.getAll,
		description: "Used to retrieve all stored `PatientVisitorResourceCategory`s",
		tags: ["Patient-Visitor Resource Category"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `PatientVisitorResourceCategory`",
				PatientVisitorResourceCategorySchema,
			),
		]),
	});
}
