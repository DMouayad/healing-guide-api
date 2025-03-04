import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { commonZodSchemas } from "src/common/zod/common";
import {
	ZodFeedbackWithResponse,
	ZodReceivedFeedback,
	receivedFeedbackRequests,
} from "src/rest-api/feedbacks/types";
import { ZodLanguage } from "src/rest-api/languages/language.types";
import { MedicalConditionZodSchema } from "src/rest-api/medicalConditions/types";
import { MedicalProcedureZodSchema } from "src/rest-api/medicalProcedures/types";
import { MedicalSpecialtyZodSchema } from "src/rest-api/medicalSpecialties/types";
import { physicianRoutes } from "src/rest-api/physician/physician.router";
import {
	PhysicianZodSchema,
	ZodNewPhysicianResource,
	ZodPhysicianRelations,
	ZodPhysicianResource,
	physicianRequests,
} from "src/rest-api/physician/physician.types";
import { ReviewRequests, ZodReview } from "src/rest-api/reviews/reviews.types";
import { z } from "zod";
import {
	duplicateResourceResponse,
	identityConfirmationRequiredResponse,
	unauthenticatedResponse,
	unauthorizedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerPhysicianPaths(registry: OpenAPIRegistry, baseUrl: string) {
	const physicianRoute = baseUrl + physicianRoutes.baseRoute;
	registry.register("Physician", PhysicianZodSchema);

	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.create,
		description: "Used to add a new `Physician` to the database",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
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
		path: physicianRoute + physicianRoutes.update,
		description: "Used to edit an existing `Physician`",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.update.body,
					},
				},
			},
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
	/** Physician Relations */
	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.treatConditions,
		description: "Used to set treated conditions of the `Physician`",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.setRelationItems.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of `MedicalCondition`",
				schema: z.array(MedicalConditionZodSchema),
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.providedProcedures,
		description: "Used to set provided procedures by a `Physician`",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.setRelationItems.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of `MedicalProcedure`",
				schema: z.array(MedicalProcedureZodSchema),
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.languages,
		description: "Used to set a `Physician` spoken languages",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.setRelationItems.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of `Language`",
				schema: z.array(ZodLanguage),
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.specialties,
		description: "Used to set the `Physician` specialties",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: physicianRequests.setRelationItems.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of `MedicalSpecialty`",
				schema: z.array(MedicalSpecialtyZodSchema),
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
	/** Physician Received Feedbacks */
	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.receivedFeedbacks("{physicianId}"),
		description: "Adds a new feedback to physician received feedbacks",
		tags: ["Physician"],
		security: [{ bearerAuth: [] }],
		request: {
			params: receivedFeedbackRequests.physician.createOrUpdate.params,
			body: {
				content: {
					"application/json": {
						schema: receivedFeedbackRequests.physician.createOrUpdate.body,
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
		path: physicianRoute + physicianRoutes.receivedFeedbacks("{physicianId}"),
		description: "Updates the auth user feedback response for physician",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: receivedFeedbackRequests.physician.createOrUpdate.params,
			body: {
				content: {
					"application/json": {
						schema: receivedFeedbackRequests.physician.createOrUpdate.body,
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
		path: physicianRoute + physicianRoutes.receivedFeedbacks("{physicianId}"),
		description: "Retrieves given feedbacks for a physician",
		tags: ["Physician"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: receivedFeedbackRequests.physician.get.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description:
					"Success: returns the information of a physician received feedbacks",
				schema: z.array(ZodFeedbackWithResponse),
			},
		]),
	});
	/**
	 * Physician Reviews
	 */
	registry.registerPath({
		method: "get",
		path: physicianRoute + physicianRoutes.getReviews("{physicianId}"),
		description: "Retrieves a list of `PhysicianReview` by physician id",
		tags: ["Physician Reviews"],
		request: {
			params: ReviewRequests.physician.getReviews.params,
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: returns a list of `PhysicianReview`",
				schema: z.array(ZodReview),
			},
		]),
	});

	registry.registerPath({
		method: "post",
		path: physicianRoute + physicianRoutes.createPhysicianReview("{physicianId}"),
		description: "Creates a new review for the physician with `physicianId`",
		tags: ["Physician Reviews"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: ReviewRequests.physician.addReviewByUser.params,
			body: {
				content: {
					"application/json": {
						schema: ReviewRequests.physician.addReviewByUser.body,
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
		path: physicianRoute + physicianRoutes.reviewById("{physicianId}", "{reviewId}"),
		description: "Updates a review identified with `reviewId` and `physicianId`",
		tags: ["Physician Reviews"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: ReviewRequests.physician.updateReview.params,
			body: {
				content: {
					"application/json": {
						schema: ReviewRequests.physician.updateReview.body,
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
		path: physicianRoute + physicianRoutes.reviewById("{physicianId}", "{reviewId}"),
		description: "Deletes a review identified with `reviewId` and `physicianId`",
		tags: ["Physician Reviews"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			params: ReviewRequests.physician.deleteReview.params,
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
