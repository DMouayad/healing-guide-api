import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { APP_ROLES } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { logger } from "@/common/utils/logger";
import { commonZodSchemas } from "@/common/zod/common";
import type { IUser } from "@/interfaces/IUser";
import type { Request, Response } from "express";
import { getUserFromResponse } from "../auth/utils";
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
async function userBelongsToPhysician(user: IUser, physicianId: number) {
	const physicianUserId =
		await getAppCtx().physicianRepository.getPhysicianUserId(physicianId);
	const matched = physicianUserId && physicianUserId === user.id;
	if (!matched) {
		logger.warn(`User ${user.id} is not authorized to access physician ${physicianId}`);
	}
	return matched;
}
