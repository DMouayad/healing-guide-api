import { patientVisitorInfoRoutes } from "@/api/patientVisitorInfo/router";
import {
	PatientVisitorInfoCategorySchema,
	PatientVisitorInfoCategorySchemas,
} from "@/api/patientVisitorInfo/types";
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

export function registerPatientVisitorInfoCategoryPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const routes = patientVisitorInfoRoutes.categories;
	const baseRoute = baseUrl + patientVisitorInfoRoutes.baseRoute;
	registry.register("PatientVisitorInfoCategory", PatientVisitorInfoCategorySchema);

	registry.registerPath({
		method: "post",
		path: baseRoute + routes.create,
		description: "Used to add a new `PatientVisitorInfoCategory` to the database",
		tags: ["Patient&Visitor Info Category"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: PatientVisitorInfoCategorySchemas.create,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new `PatientVisitorInfoCategory` was created",
				schema: PatientVisitorInfoCategorySchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PatientVisitorInfoCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: baseRoute + routes.update("{id}"),
		description: "Used to edit an existing `PatientVisitorInfoCategory`",
		tags: ["Patient&Visitor Info Category"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: PatientVisitorInfoCategorySchemas.update,
					},
				},
			},
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success:`PatientVisitorInfoCategory` was updated",
				schema: PatientVisitorInfoCategorySchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PatientVisitorInfoCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: baseRoute + routes.delete("{id}"),
		description: "Used by an admin to delete a specific `PatientVisitorInfoCategory`",
		tags: ["Patient&Visitor Info Category"],
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
		description: "Used to retrieve all stored `PatientVisitorInfoCategory`s",
		tags: ["Patient&Visitor Info Category"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `PatientVisitorInfoCategory`",
				PatientVisitorInfoCategorySchema,
			),
		]),
	});
}
