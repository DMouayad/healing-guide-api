import type { Request, Response } from "express";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import { APP_ROLES } from "src/common/types";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { commonZodSchemas } from "src/common/zod/common";
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
