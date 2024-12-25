import { medicalConditionsRoutes } from "@/api/medicalConditions/router";
import { MedicalConditionZodSchema } from "@/api/medicalConditions/types";
import { commonZodSchemas, requestWithIdParamSchema } from "@/common/zod/common";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import {
	duplicateResourceResponse,
	paginatedJsonResponse,
	unauthenticatedResponse,
	unauthorizedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";

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
		path: medicalConditionsRoute + medicalConditionsRoutes.edit,
		description: "Used to edit an existing `Medical Condition`",
		tags: ["Medical Conditions"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: commonZodSchemas.requestBodyWithName,
					},
				},
			},
			params: requestWithIdParamSchema,
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
		path: medicalConditionsRoute + medicalConditionsRoutes.delete,
		description: "Used by an admin to delete a specific `Medical Condition`",
		tags: ["Medical Conditions"],
		request: {
			params: requestWithIdParamSchema,
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
		path: medicalConditionsRoute + medicalConditionsRoutes.getByID,
		description: "Used to retrieve a `Medical Condition` by id",
		tags: ["Medical Conditions"],
		request: {
			params: requestWithIdParamSchema,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: Returns a `MedicalCondition` if exists",
				schema: MedicalConditionZodSchema.optional(),
			},
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