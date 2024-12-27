import { physicianRoutes } from "@/api/physician/physician.router";
import {
	PhysicianZodSchema,
	ZodNewPhysicianResource,
	ZodPhysicianRelations,
	ZodPhysicianResource,
	physicianRequests,
} from "@/api/physician/physician.types";
import { commonZodSchemas } from "@/common/zod/common";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import {
	duplicateResourceResponse,
	identityConfirmationRequiredResponse,
	unauthenticatedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";

export function registerPhysicianPaths(registry: OpenAPIRegistry, baseUrl: string) {
	const physicianRoute = baseUrl + physicianRoutes.baseRoute;
	registry.register("Physician", PhysicianZodSchema);

	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.create,
		description: "Used to add a new `Physician` to the database",
		tags: ["Physician"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.create,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new `Physician` was created",
				schema: ZodNewPhysicianResource,
			},
			unauthenticatedResponse,
			identityConfirmationRequiredResponse,
			duplicateResourceResponse("Failure: a `Physician` already exists for this user"),
		]),
	});
	registry.registerPath({
		method: "patch",
		path: physicianRoute + physicianRoutes.update("{id}"),
		description: "Used to edit an existing `Physician`",
		tags: ["Physician"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.update,
					},
				},
			},
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success:`Physician` was updated",
				schema: ZodNewPhysicianResource,
			},
			unauthenticatedResponse,
			identityConfirmationRequiredResponse,
			duplicateResourceResponse("Failure: a `Physician` already exists for this user"),
		]),
	});

	registry.registerPath({
		method: "get",
		path: physicianRoute + physicianRoutes.getById("{id}"),
		description: "Used to retrieve a `Physician` by id",
		tags: ["Physician"],
		request: {
			params: commonZodSchemas.requestIdParam,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: Returns a `Physician` if exists",
				schema: ZodPhysicianResource.merge(ZodPhysicianRelations).optional(),
			},
		]),
	});
}
