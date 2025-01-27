import { medicalFacilityRoutes } from "@/api/medicalFacility/medicalFacility.router";
import { PatientVisitorResourcesRequests } from "@/api/medicalFacility/patientVisitorResource.requests";
import { ZodPatientVisitorResource } from "@/api/patientVisitorResource/types";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { unauthenticatedResponse, unauthorizedResponse } from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerFacilityPatientVisitorResourcesPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const routes = medicalFacilityRoutes.patientsAndVisitors;
	const baseRoute = baseUrl + medicalFacilityRoutes.baseRoute;

	// public routes
	registry.registerPath({
		method: "get",
		path: baseRoute + routes.publicRoutes.getFacilityItems("{facilityId}"),
		description: "Retrieves a list of resources for a medical facility",
		tags: ["Medical Facility Patient-Visitor Resources"],
		request: {
			params: PatientVisitorResourcesRequests.getByFacilityId.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of facility resources",
				schema: ZodPatientVisitorResource.array(),
			},
		]),
	});

	registry.registerPath({
		method: "get",
		path:
			baseRoute +
			routes.publicRoutes.getByIdAndFacilityId("{facilityId}", "{resourceId}"),
		description: "Retrieves a resource for a medical facility",
		tags: ["Medical Facility Patient-Visitor Resources"],
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns the resource",
				schema: ZodPatientVisitorResource,
			},
		]),
	});
	// Facility Manager Routes
	registry.registerPath({
		method: "post",
		path: baseRoute + routes.managerRoutes.index,
		description: "Create a new patient-visitor resource",
		tags: ["Medical Facility Patient-Visitor Resources"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: PatientVisitorResourcesRequests.create.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns the created resource",
				schema: ZodPatientVisitorResource,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
	registry.registerPath({
		method: "put",
		path: baseRoute + routes.managerRoutes.byId("{resourceId}"),
		description: "Update an existing patient-visitor resource",
		tags: ["Medical Facility Patient-Visitor Resources"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: PatientVisitorResourcesRequests.update.params,
			body: {
				content: {
					"application/json": {
						schema: PatientVisitorResourcesRequests.update.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns the updated resource",
				schema: ZodPatientVisitorResource,
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});

	registry.registerPath({
		method: "delete",
		path: baseRoute + routes.managerRoutes.byId("{resourceId}"),
		description: "Deletes a facility resource",
		tags: ["Medical Facility Patient-Visitor Resources"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: PatientVisitorResourcesRequests.delete.params,
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
