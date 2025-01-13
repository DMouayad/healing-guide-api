import { medicalConditionsRoutes } from "@api/medicalConditions/router";
import { MedicalConditionZodSchema } from "@api/medicalConditions/types";
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

export function registerMedicalConditionsPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const medicalConditionsRoute = baseUrl + medicalConditionsRoutes.baseRoute;
	registry.register("MedicalCondition", MedicalConditionZodSchema);

	registry.registerPath({
		method: "post",
		path: medicalConditionsRoute + medicalConditionsRoutes.add,
		description: "Used to add a new `Medical Condition` to the database",
		tags: ["Medical Conditions"],
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
				description: "Success: a new `MedicalCondition` was created",
				schema: MedicalConditionZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Condition` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: medicalConditionsRoute + medicalConditionsRoutes.edit("{id}"),
		description: "Used to edit an existing `Medical Condition`",
		tags: ["Medical Conditions"],
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
				description: "Success:`MedicalCondition` was updated",
				schema: MedicalConditionZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Condition` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: medicalConditionsRoute + medicalConditionsRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `Medical Condition`",
		tags: ["Medical Conditions"],
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
		path: medicalConditionsRoute + medicalConditionsRoutes.getAll,
		description: "Used to retrieve all stored `Medical Condition`s",
		tags: ["Medical Conditions"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `MedicalCondition`",
				MedicalConditionZodSchema,
			),
		]),
	});
}
