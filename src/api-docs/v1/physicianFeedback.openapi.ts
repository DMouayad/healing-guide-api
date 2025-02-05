import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { commonZodSchemas } from "src/common/zod/common";
import {
	FeedbackCategoryZodSchema,
	FeedbackQuestionZodSchema,
	FeedbackZodSchema,
	UpdateFeedbackQuestionDTOSchema,
} from "src/rest-api/feedbacks/types";
import { physicianFeedbackRoutes } from "src/rest-api/physician/physician.router";
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
	const routes = physicianFeedbackRoutes;
	const basePath = baseUrl + routes.baseRoute;
	registry.register("FeedbackCategory", FeedbackCategoryZodSchema);
	registry.register("Feedback", FeedbackZodSchema);
	registry.register("FeedbackQuestion", FeedbackQuestionZodSchema);

	registry.registerPath({
		method: "post",
		path: basePath + routes.addCategory,
		description: "Used to add a new `FeedbackCategory` to the database",
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
				description: "Success: a new `FeedbackCategory` was created",
				schema: FeedbackCategoryZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FeedbackCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: basePath + routes.editCategory("{id}"),
		description: "Used to edit an existing `FeedbackCategory`",
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
				description: "Success:`FeedbackCategory` was updated",
				schema: FeedbackCategoryZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FeedbackCategory` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: basePath + routes.deleteCategory("{id}"),
		description: "Used by an admin to delete a specific `FeedbackCategory`",
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
		path: basePath + routes.addQuestion,
		description: "Used to add a new `FeedbackQuestion` to the database",
		tags: ["Physician Feedback"],
		security: [{ [v1BearerAuth.name]: [] }],

		request: {
			body: {
				content: {
					"application/json": {
						schema: UpdateFeedbackQuestionDTOSchema,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new `FeedbackQuestion` was created",
				schema: FeedbackQuestionZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FeedbackQuestion` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: basePath + routes.editQuestion("{id}"),
		description: "Used to edit an existing `FeedbackQuestion`",
		tags: ["Physician Feedback"],
		security: [{ [v1BearerAuth.name]: [] }],

		request: {
			body: {
				content: {
					"application/json": {
						schema: UpdateFeedbackQuestionDTOSchema,
					},
				},
			},
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: `FeedbackQuestion` was updated",
				schema: FeedbackQuestionZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `FeedbackQuestion` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: basePath + routes.deleteQuestion("{id}"),
		description: "Used by an admin to delete a specific `FeedbackQuestion`",
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
		path: basePath + routes.getAll,
		description: "Used to retrieve a list of `Feedback`",
		tags: ["Physician Feedback"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse("Success: Returns a list of `Feedback`", FeedbackZodSchema),
		]),
	});
}
