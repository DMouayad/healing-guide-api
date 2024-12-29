import { medicalProceduresRoutes } from "@/api/medicalProcedures/router";
import { MedicalProcedureZodSchema } from "@/api/medicalProcedures/types";
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
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerMedicalProceduresPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const medicalProceduresRoute = baseUrl + medicalProceduresRoutes.baseRoute;
	registry.register("MedicalProcedure", MedicalProcedureZodSchema);

	registry.registerPath({
		method: "post",
		path: medicalProceduresRoute + medicalProceduresRoutes.add,
		description: "Used to add a new `Medical Procedure` to the database",
		tags: ["Medical Procedures"],
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
				description: "Success: a new `MedicalProcedure` was created",
				schema: MedicalProcedureZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Procedure` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: medicalProceduresRoute + medicalProceduresRoutes.edit("{id}"),
		description: "Used to edit an existing `Medical Procedure`",
		tags: ["Medical Procedures"],
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
				description: "Success:`MedicalProcedure` was updated",
				schema: MedicalProcedureZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Procedure` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: medicalProceduresRoute + medicalProceduresRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `Medical Procedure`",
		tags: ["Medical Procedures"],
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
		path: medicalProceduresRoute + medicalProceduresRoutes.getByID("{id}"),
		description: "Used to retrieve a `Medical Procedure` by id",
		tags: ["Medical Procedures"],
		request: {
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: Returns a `MedicalProcedure` if exists",
				schema: MedicalProcedureZodSchema.optional(),
			},
		]),
	});
	registry.registerPath({
		method: "get",
		path: medicalProceduresRoute + medicalProceduresRoutes.getAll,
		description: "Used to retrieve all stored `Medical Procedure`s",
		tags: ["Medical Procedures"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `MedicalProcedure`",
				MedicalProcedureZodSchema,
			),
		]),
	});
}
