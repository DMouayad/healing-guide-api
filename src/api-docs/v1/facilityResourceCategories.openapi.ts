import { facilityResourceCategoryRoutes } from "@/api/facilityResourceCategory/router";
import { FacilityResourceCategoryZodSchema } from "@/api/facilityResourceCategory/types";
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

export function registerFacilityResourceCategoryPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const FacilityResourceCategoryRoute =
		baseUrl + facilityResourceCategoryRoutes.baseRoute;
	registry.register("FacilityResourceCategory", FacilityResourceCategoryZodSchema);

	registry.registerPath({
		method: "post",
		path: FacilityResourceCategoryRoute + facilityResourceCategoryRoutes.add,
		description: "Used to add a new `FacilityResourceCategory` to the database",
		tags: ["Facility Resource Category"],
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
				description: "Success: a new `FacilityResourceCategory` was created",
				schema: FacilityResourceCategoryZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FacilityResourceCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: FacilityResourceCategoryRoute + facilityResourceCategoryRoutes.edit("{id}"),
		description: "Used to edit an existing `FacilityResourceCategory`",
		tags: ["Facility Resource Category"],
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
				description: "Success:`FacilityResourceCategory` was updated",
				schema: FacilityResourceCategoryZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FacilityResourceCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: FacilityResourceCategoryRoute + facilityResourceCategoryRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `FacilityResourceCategory`",
		tags: ["Facility Resource Category"],
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
		path: FacilityResourceCategoryRoute + facilityResourceCategoryRoutes.getAll,
		description: "Used to retrieve all stored `FacilityResourceCategory`s",
		tags: ["Facility Resource Category"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `FacilityResourceCategory`",
				FacilityResourceCategoryZodSchema,
			),
		]),
	});
}
