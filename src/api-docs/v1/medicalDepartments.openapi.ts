import {
	addMedDepartmentSchema,
	medicalDepartmentsRoutes,
	updateMedDepartmentSchema,
} from "@/api/medicalDepartments/router";
import { MedicalDepartmentZodSchema } from "@/api/medicalDepartments/types";
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

export function registerMedicalDepartmentsPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const medicalDepartmentsRoute = `${baseUrl}/medical-departments`;
	registry.register("MedicalDepartment", MedicalDepartmentZodSchema);

	registry.registerPath({
		method: "post",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.add,
		description: "Used to add a new `Medical Department` to the database",
		tags: ["Admin Only", "Medical Departments"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: addMedDepartmentSchema.body,
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
			unauthenticatedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Department` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.edit,
		description: "Used to edit an existing `Medical Department`",
		tags: ["Admin Only", "Medical Departments"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: updateMedDepartmentSchema.body,
					},
				},
			},
			params: requestWithIdParamSchema,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success:`MedicalDepartment` was updated",
				schema: MedicalDepartmentZodSchema,
			},
			unauthenticatedResponse,
			unauthenticatedResponse,
			duplicateResourceResponse(
				"Failure: a `Medical Department` already exists with the same name",
			),
		]),
	});
	registry.registerPath({
		method: "delete",
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.delete,
		description: "Used by an admin to delete a specific `Medical Department`",
		tags: ["Admin Only", "Medical Departments"],
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
		path: medicalDepartmentsRoute + medicalDepartmentsRoutes.getByID,
		description: "Used to retrieve a `Medical Department` by id",
		tags: ["Medical Departments"],
		request: {
			params: requestWithIdParamSchema,
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
