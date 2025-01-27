import { medicalFacilityRoutes } from "@/api/medicalFacility/medicalFacility.router";
import { ReviewRequests, ZodReview } from "@/api/reviews/reviews.types";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { unauthenticatedResponse } from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerMedicalFacilityReviewsPaths(
	registry: OpenAPIRegistry,
	baseUrl: string,
) {
	const routes = medicalFacilityRoutes;
	const baseRoute = baseUrl + medicalFacilityRoutes.baseRoute;
	registry.registerPath({
		method: "get",
		path: baseRoute + routes.getReviews("{facilityId}"),
		description: "Retrieves a list of `Review` by physician id",
		tags: ["Medical Facility Reviews"],
		request: {
			params: ReviewRequests.facility.getReviews.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of `Review`",
				schema: z.array(ZodReview),
			},
		]),
	});

	registry.registerPath({
		method: "post",
		path: baseRoute + routes.createFacilityReview("{facilityId}"),
		description: "Creates a new review for the physician with `facilityId`",
		tags: ["Medical Facility Reviews"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: ReviewRequests.facility.addReviewByUser.params,
			body: {
				content: {
					"application/json": {
						schema: ReviewRequests.facility.addReviewByUser.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: review was created",
				schema: ZodReview,
			},
			unauthenticatedResponse,
		]),
	});
	registry.registerPath({
		method: "patch",
		path: baseRoute + routes.reviewById("{facilityId}", "{reviewId}"),
		description: "Updates a review identified with `reviewId` and `facilityId`",
		tags: ["Medical Facility Reviews"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: ReviewRequests.facility.updateReview.params,
			body: {
				content: {
					"application/json": {
						schema: ReviewRequests.facility.updateReview.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: review was updated",
				schema: ZodReview,
			},
			unauthenticatedResponse,
		]),
	});
	registry.registerPath({
		method: "delete",
		path: baseRoute + routes.reviewById("{facilityId}", "{reviewId}"),
		description: "Deletes a review identified with `reviewId` and `facilityId`",
		tags: ["Medical Facility Reviews"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: ReviewRequests.facility.deleteReview.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: review was deleted",
			},
			unauthenticatedResponse,
		]),
	});
}
