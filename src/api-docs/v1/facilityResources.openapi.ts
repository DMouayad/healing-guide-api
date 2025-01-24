import {
	FacilityResourcesRequests,
	ZodFacilityResource,
} from "@/api/medicalFacility/facilityResources.types";
import { medicalFacilityRoutes } from "@/api/medicalFacility/medicalFacility.router";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { unauthenticatedResponse, unauthorizedResponse } from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerFacilityResourcesPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const routes = medicalFacilityRoutes;
	const baseRoute = baseUrl + medicalFacilityRoutes.baseRoute;

	registry.registerPath({
		method: "get",
		path: baseRoute + routes.resources("{facilityId}"),
		description: "Retrieves a list of resources for a medical facility",
		tags: ["Medical Facility Resources"],
		request: {
			params: FacilityResourcesRequests.getByFacilityId.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of facility resources",
				schema: ZodFacilityResource.array(),
			},
		]),
	});

	registry.registerPath({
		method: "post",
		path: baseRoute + routes.resources("{facilityId}"),
		description: "Creates a new resource for the medical facility",
		tags: ["Medical Facility Resources"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: FacilityResourcesRequests.create.params,
			body: {
				content: {
					"application/json": {
						schema: FacilityResourcesRequests.create.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: returns the created resource",
				schema: ZodFacilityResource,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});

	registry.registerPath({
		method: "patch",
		path: baseRoute + routes.resourceById("{facilityId}", "{resourceId}"),
		description: "Updates an existing facility resource",
		tags: ["Medical Facility Resources"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: FacilityResourcesRequests.update.params,
			body: {
				content: {
					"application/json": {
						schema: FacilityResourcesRequests.update.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns the updated resource",
				schema: ZodFacilityResource,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});

	registry.registerPath({
		method: "delete",
		path: baseRoute + routes.resourceById("{facilityId}", "{resourceId}"),
		description: "Deletes a facility resource",
		tags: ["Medical Facility Resources"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: FacilityResourcesRequests.delete.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: resource deleted",
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
}
