import { medicalDepartmentsRoutes } from "@/api/medicalDepartments/router";
import { MedicalDepartmentZodSchema } from "@/api/medicalDepartments/types";
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

export function registerMedicalDepartmentsPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const medicalDepartmentsRoute = baseUrl + medicalDepartmentsRoutes.baseRoute;
	registry.register("MedicalDepartment", MedicalDepartmentZodSchema);

	registry.registerPath({
		method: "post",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.add,
		description: "Used to add a new `Medical Department` to the database",
		tags: ["Medical Departments"],
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
				description: "Success: a new `MedicalDepartment` was created",
				schema: MedicalDepartmentZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Department` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.edit("{id}"),
		description: "Used to edit an existing `Medical Department`",
		tags: ["Medical Departments"],
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
				description: "Success:`MedicalDepartment` was updated",
				schema: MedicalDepartmentZodSchema,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Department` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.delete("{id}"),
		description: "Used by an admin to delete a specific `Medical Department`",
		tags: ["Medical Departments"],
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
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.getByID("{id}"),
		description: "Used to retrieve a `Medical Department` by id",
		tags: ["Medical Departments"],
		request: {
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: Returns a `MedicalDepartment` if exists",
				schema: MedicalDepartmentZodSchema.optional(),
			},
		]),
	});
	registry.registerPath({
		method: "get",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.getAll,
		description: "Used to retrieve all stored `Medical Department`s",
		tags: ["Medical Departments"],
		request: {
			query: commonZodSchemas.queryParams,
		},
		responses: createApiResponses([
			paginatedJsonResponse(
				"Success: Returns a list of `MedicalDepartment`",
				MedicalDepartmentZodSchema,
			),
		]),
	});
}
