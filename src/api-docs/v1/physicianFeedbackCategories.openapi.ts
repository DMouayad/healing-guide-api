import { physicianFeedbackCategoriesRoutes } from "@/api/physicianFeedbackCategories/router";
import { PhysicianFeedbackCategoryZodSchema } from "@/api/physicianFeedbackCategories/types";
import { commonZodSchemas } from "@/common/zod/common";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import {
	duplicateResourceResponse,
	paginatedJsonResponse,
	unauthenticatedResponse,
	unauthorizedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";

export function registerPhysicianFeedbackCategoriesPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const physicianFeedbackCategoriesRoute =
		baseUrl + physicianFeedbackCategoriesRoutes.baseRoute;
	registry.register("PhysicianFeedbackCategory", PhysicianFeedbackCategoryZodSchema);

	registry.registerPath({
		method: "post",
		path: physicianFeedbackCategoriesRoute + physicianFeedbackCategoriesRoutes.add,
		description: "Used to add a new `PhysicianFeedbackCategory` to the database",
		tags: ["Physician Feedback Category"],
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
				description: "Success: a new `PhysicianFeedbackCategory` was created",
				schema: PhysicianFeedbackCategoryZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PhysicianFeedbackCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: physicianFeedbackCategoriesRoute + physicianFeedbackCategoriesRoutes.edit,
		description: "Used to edit an existing `PhysicianFeedbackCategory`",
		tags: ["Physician Feedback Category"],
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
				description: "Success:`PhysicianFeedbackCategory` was updated",
				schema: PhysicianFeedbackCategoryZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PhysicianFeedbackCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: physicianFeedbackCategoriesRoute + physicianFeedbackCategoriesRoutes.delete,
		description: "Used by an admin to delete a specific `PhysicianFeedbackCategory`",
		tags: ["Physician Feedback Category"],
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
		path: physicianFeedbackCategoriesRoute + physicianFeedbackCategoriesRoutes.getAll,
		description: "Used to retrieve all stored `PhysicianFeedbackCategory`s",
		tags: ["Physician Feedback Category"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `PhysicianFeedbackCategory`",
				PhysicianFeedbackCategoryZodSchema,
			),
		]),
	});
}
