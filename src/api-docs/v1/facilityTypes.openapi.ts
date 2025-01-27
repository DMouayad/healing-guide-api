import { facilityTypesRoutes } from "@/api/facilityTypes/router";
import { FacilityTypeZodSchema } from "@/api/facilityTypes/types";
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

export function registerFacilityTypePaths(registry: OpenAPIRegistry, baseUrl: string) {
	const FacilityTypeRoute = baseUrl + facilityTypesRoutes.baseRoute;
	registry.register("FacilityType", FacilityTypeZodSchema);

	registry.registerPath({
		method: "post",
		path: FacilityTypeRoute + facilityTypesRoutes.add,
		description: "Used to add a new `FacilityType` to the database",
		tags: ["Facility Type"],
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
				description: "Success: a new `FacilityType` was created",
				schema: FacilityTypeZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FacilityType` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: FacilityTypeRoute + facilityTypesRoutes.edit("{id}"),
		description: "Used to edit an existing `FacilityType`",
		tags: ["Facility Type"],
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
				description: "Success:`FacilityType` was updated",
				schema: FacilityTypeZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FacilityType` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: FacilityTypeRoute + facilityTypesRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `FacilityType`",
		tags: ["Facility Type"],
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
		path: FacilityTypeRoute + facilityTypesRoutes.getAll,
		description: "Used to retrieve all stored `FacilityType`s",
		tags: ["Facility Type"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `FacilityType`",
				FacilityTypeZodSchema,
			),
		]),
	});
}
