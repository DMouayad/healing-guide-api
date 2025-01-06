import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { APP_ROLES } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { commonZodSchemas } from "@/common/zod/common";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserFromResponse } from "../auth/utils";
import type {
	CreatePhysicianReviewDTO,
	UpdatePhysicianReviewDTO,
} from "./PhysicianReview";
import { createNewPhysicianResource, physicianRequests } from "./physician.types";

export async function createAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	const data = await physicianRequests.create.parseAsync(req.body);
	return getAppCtx().physicianRepository.store({ ...data, userId: user.id });
}
export async function updateAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	if (!user.isAuthorizedAs(APP_ROLES.physician)) {
		throw AppError.FORBIDDEN();
	}
	const body = physicianRequests.update.body.parse(req.body);

	const updated = await getAppCtx().physicianRepository.updateByUserId(user.id, body);
	return ApiResponse.success({ data: updated }).send(res);
}

export async function getByIdAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	const physician = await getAppCtx().physicianRepository.getWithRelations(params.id);
	const response = physician
		? ApiResponse.success({ data: createNewPhysicianResource(physician) })
		: ApiResponse.error(AppError.ENTITY_NOT_FOUND());
	response.send(res);
}
/** Physician Received Feedbacks */
export async function createFeedbackAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	const params = physicianRequests.createOrUpdateFeedback.params.parse(req.params);
	const body = physicianRequests.createOrUpdateFeedback.body.parse(req.body);
	await getAppCtx().physicianReceivedFeedbackRepository.create({
		userId: user.id,
		physicianId: params.physicianId,
		questionId: body.questionId,
		response: body.response,
	});
	return ApiResponse.success().send(res);
}
export async function updateFeedbackAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	const params = physicianRequests.createOrUpdateFeedback.params.parse(req.params);
	const body = physicianRequests.createOrUpdateFeedback.body.parse(req.body);
	const updatedFeedback =
		await getAppCtx().physicianReceivedFeedbackRepository.updateFeedbackResponse({
			userId: user.id,
			physicianId: params.physicianId,
			questionId: body.questionId,
			response: body.response,
		});
	return ApiResponse.success({ data: updatedFeedback }).send(res);
}
export async function getPhysicianFeedbacksAction(req: Request, res: Response) {
	const user = getUserFromResponse(res, false);
	const params = physicianRequests.getPhysicianFeedbacks.params.parse(req.params);
	const result =
		await getAppCtx().physicianReceivedFeedbackRepository.getPhysicianFeedbackWithUserResponses(
			params.physicianId,
			user?.id,
		);
	ApiResponse.success({ data: result }).send(res);
}

async function setPhysicianRelationAction(
	req: Request,
	res: Response,
	repositoryResult: (
		physicianId: number,
		relationItemsIds: number[],
	) => Promise<object[]>,
) {
	const user = getUserFromResponse(res);
	const data = physicianRequests.setRelationItems.body.parse(req.body);

	const physician = await getAppCtx().physicianRepository.getByUserId(user.id);
	if (!physician) {
		throw AppError.FORBIDDEN();
	}
	const result = await repositoryResult(physician.id, data.itemsIds);
	return ApiResponse.success({ data: result }).send(res);
}

/** Treat Conditions Actions */
export async function setTreatConditions(req: Request, res: Response) {
	return setPhysicianRelationAction(
		req,
		res,
		getAppCtx().physicianRepository.setPhysicianTreatedConditions,
	);
}
/** Provided Procedures Actions */
export async function setProvidedProcedures(req: Request, res: Response) {
	return setPhysicianRelationAction(
		req,
		res,
		getAppCtx().physicianRepository.setPhysicianProvidedProcedures,
	);
}
/** Languages Actions */
export async function setSpokenLanguages(req: Request, res: Response) {
	return setPhysicianRelationAction(
		req,
		res,
		getAppCtx().physicianRepository.setPhysicianLanguages,
	);
}
/** Specialties Actions */
export async function setSpecialties(req: Request, res: Response) {
	return setPhysicianRelationAction(
		req,
		res,
		getAppCtx().physicianRepository.setPhysicianSpecialties,
	);
}
/** Reviews Actions */

export async function getPhysicianReviews(req: Request, res: Response) {
	const params = physicianRequests.getPhysicianReviews.params.parse(req.params);

	const reviews = getAppCtx().physicianReviewsRepository.getAllById(params.physicianId);
	return ApiResponse.success({ data: reviews }).send(res);
}
export async function createReviewByUser(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	const { physicianId } = physicianRequests.addReviewByUser.params.parse(req.params);
	const body = physicianRequests.addReviewByUser.body.parse(req.body);
	const dto: CreatePhysicianReviewDTO = {
		physicianId,
		reviewerId: user.id,
		reviewerName: body.reviewerName,
		reviewStars: body.reviewStars,
		reviewText: body.reviewText,
	};
	const newReview = getAppCtx().physicianReviewsRepository.store(dto);
	return ApiResponse.success({ data: newReview, statusCode: StatusCodes.CREATED }).send(
		res,
	);
}
export async function editReview(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	const { physicianId, reviewId } = physicianRequests.updateReview.params.parse(
		req.params,
	);
	const body = physicianRequests.updateReview.body.parse(req.body);
	const dto: UpdatePhysicianReviewDTO = {
		reviewId,
		physicianId,
		reviewerId: user.id,
		reviewerName: body.reviewerName,
		reviewStars: body.reviewStars,
		reviewText: body.reviewText,
	};
	const newReview = getAppCtx().physicianReviewsRepository.update(dto);
	return ApiResponse.success({ data: newReview }).send(res);
}
export async function deleteReview(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	const { physicianId, reviewId } = physicianRequests.deleteReview.params.parse(
		req.params,
	);
	await getAppCtx().physicianReviewsRepository.deleteReview({
		physicianId,
		reviewId,
		reviewerId: user.id,
	});
	return ApiResponse.success().send(res);
}
