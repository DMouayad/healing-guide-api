import { physicianFeedbackRoutes } from "@api/physicianFeedback/router";
import {
	PhysicianFeedbackCategoryZodSchema,
	PhysicianFeedbackQuestionZodSchema,
	PhysicianFeedbackZodSchema,
	UpdatePhysicianFeedbackQuestionDTOSchema,
} from "@api/physicianFeedback/types";
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

export function registerPhysicianFeedbackPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const basePath = baseUrl + physicianFeedbackRoutes.baseRoute;
	registry.register("PhysicianFeedbackCategory", PhysicianFeedbackCategoryZodSchema);
	registry.register("PhysicianFeedback", PhysicianFeedbackZodSchema);
	registry.register("PhysicianFeedbackQuestion", PhysicianFeedbackQuestionZodSchema);

	registry.registerPath({
		method: "post",
		path: basePath + physicianFeedbackRoutes.addCategory,
		description: "Used to add a new `PhysicianFeedbackCategory` to the database",
		tags: ["Physician Feedback"],
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
		path: basePath + physicianFeedbackRoutes.editCategory("{id}"),
		description: "Used to edit an existing `PhysicianFeedbackCategory`",
		tags: ["Physician Feedback"],
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
		path: basePath + physicianFeedbackRoutes.deleteCategory("{id}"),
		description: "Used by an admin to delete a specific `PhysicianFeedbackCategory`",
		tags: ["Physician Feedback"],
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
		method: "post",
		path: basePath + physicianFeedbackRoutes.addQuestion,
		description: "Used to add a new `PhysicianFeedbackQuestion` to the database",
		tags: ["Physician Feedback"],
		security: [{ [v1BearerAuth.name]: [] }],

		request: {
			body: {
				content: {
					"application/json": {
						schema: UpdatePhysicianFeedbackQuestionDTOSchema,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new `PhysicianFeedbackQuestion` was created",
				schema: PhysicianFeedbackQuestionZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PhysicianFeedbackQuestion` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: basePath + physicianFeedbackRoutes.editQuestion("{id}"),
		description: "Used to edit an existing `PhysicianFeedbackQuestion`",
		tags: ["Physician Feedback"],
		security: [{ [v1BearerAuth.name]: [] }],

		request: {
			body: {
				content: {
					"application/json": {
						schema: UpdatePhysicianFeedbackQuestionDTOSchema,
					},
				},
			},
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: `PhysicianFeedbackQuestion` was updated",
				schema: PhysicianFeedbackQuestionZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `PhysicianFeedbackQuestion` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: basePath + physicianFeedbackRoutes.deleteQuestion("{id}"),
		description: "Used by an admin to delete a specific `PhysicianFeedbackQuestion`",
		tags: ["Physician Feedback"],
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
		path: basePath + physicianFeedbackRoutes.getAll,
		description: "Used to retrieve a list of `PhysicianFeedback`",
		tags: ["Physician Feedback"],
		security: [{ [v1BearerAuth.name]: [] }],

		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `PhysicianFeedback`",
				PhysicianFeedbackZodSchema,
			),
		]),
	});
}
