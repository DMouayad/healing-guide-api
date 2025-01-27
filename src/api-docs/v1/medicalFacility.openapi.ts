import {
	ZodFeedbackWithResponse,
	ZodReceivedFeedback,
	receivedFeedbackRequests,
} from "@/api/feedbacks/types";
import { medicalFacilityRoutes } from "@/api/medicalFacility/medicalFacility.router";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { unauthenticatedResponse } from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerMedicalFacilityPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const routes = medicalFacilityRoutes;
	const baseRoute = baseUrl + medicalFacilityRoutes.baseRoute;
	// registry.register("MedicalFacility", MedicalFacilityZodSchema);

	/** MedicalFacility Received Feedbacks */
	registry.registerPath({
		method: "post",
		path: baseRoute + routes.receivedFeedbacks("{facilityId}"),
		description: "Adds a new feedback to facility received feedbacks",
		tags: ["MedicalFacility"],
		security: [{ bearerAuth: [] }],
		request: {
			params: receivedFeedbackRequests.facility.createOrUpdate.params,
			body: {
				content: {
					"application/json": {
						schema: receivedFeedbackRequests.facility.createOrUpdate.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: feedback was added",
			},
			unauthenticatedResponse,
		]),
	});
	registry.registerPath({
		method: "patch",
		path: baseRoute + routes.receivedFeedbacks("{facilityId}"),
		description: "Updates the auth user feedback response for facility",
		tags: ["MedicalFacility"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: receivedFeedbackRequests.facility.createOrUpdate.params,
			body: {
				content: {
					"application/json": {
						schema: receivedFeedbackRequests.facility.createOrUpdate.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: feedback was updated",
				schema: ZodReceivedFeedback,
			},
			unauthenticatedResponse,
		]),
	});
	registry.registerPath({
		method: "get",
		path: baseRoute + routes.receivedFeedbacks("{facilityId}"),
		description: "Retrieves given feedbacks for a facility",
		tags: ["MedicalFacility"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: receivedFeedbackRequests.facility.get.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description:
					"Success: returns the information of a facility received feedbacks",
				schema: z.array(ZodFeedbackWithResponse),
			},
		]),
	});
}
