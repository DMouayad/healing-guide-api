import { medicalSpecialtiesRoutes } from "@/api/medicalSpecialties/router";
import { MedicalSpecialtyZodSchema } from "@/api/medicalSpecialties/types";
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

export function registerMedicalSpecialtiesPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const medicalSpecialtiesRoute = baseUrl + medicalSpecialtiesRoutes.baseRoute;
	registry.register("MedicalSpecialty", MedicalSpecialtyZodSchema);

	registry.registerPath({
		method: "post",
		path: medicalSpecialtiesRoute + medicalSpecialtiesRoutes.add,
		description: "Used to add a new `Medical Specialty` to the database",
		tags: ["Medical Specialties"],
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
				description: "Success: a new `MedicalSpecialty` was created",
				schema: MedicalSpecialtyZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Specialty` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: medicalSpecialtiesRoute + medicalSpecialtiesRoutes.edit("{id}"),
		description: "Used to edit an existing `Medical Specialty`",
		tags: ["Medical Specialties"],
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
				description: "Success:`MedicalSpecialty` was updated",
				schema: MedicalSpecialtyZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Specialty` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: medicalSpecialtiesRoute + medicalSpecialtiesRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `Medical Specialty`",
		tags: ["Medical Specialties"],
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
		path: medicalSpecialtiesRoute + medicalSpecialtiesRoutes.getByID("{id}"),
		description: "Used to retrieve a `Medical Specialty` by id",
		tags: ["Medical Specialties"],
		request: {
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: Returns a `MedicalSpecialty` if exists",
				schema: MedicalSpecialtyZodSchema.optional(),
			},
		]),
	});
	registry.registerPath({
		method: "get",
		path: medicalSpecialtiesRoute + medicalSpecialtiesRoutes.getAll,
		description: "Used to retrieve all stored `Medical Specialty`s",
		tags: ["Medical Specialties"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `MedicalSpecialty`",
				MedicalSpecialtyZodSchema,
			),
		]),
	});
}
