import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { getUserFromResponse } from "../auth/utils";
import { PatientVisitorResourcesRequests } from "./patientVisitorResource.requests";

export function createFacilityPatientVisitorResourceActions() {
	const { patientVisitorResourceRepository: repository } = getAppCtx();

	return {
		async getItemsByFacilityId(req: Request, res: Response) {
			const { facilityId } =
				PatientVisitorResourcesRequests.getByFacilityId.params.parse(req.params);
			const resources = await repository.getByFacilityId(facilityId);
			return ApiResponse.success({ data: resources }).send(res);
		},

		async getByIdAndFacilityId(req: Request, res: Response) {
			const { resourceId, facilityId } =
				PatientVisitorResourcesRequests.getByIdAndFacilityId.params.parse(req.params);
			const resource = await repository.getByIdAndFacilityId(resourceId, facilityId);
			return ApiResponse.success({ data: resource }).send(res);
		},
		async getItemsForCurrentUser(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const items = await repository.getItemsByUserId(user.id);
			return ApiResponse.success({ data: items }).send(res);
		},

		async getItemByIdForCurrentUser(req: Request, res: Response) {
			const { resourceId } = PatientVisitorResourcesRequests.getById.params.parse(
				req.params,
			);
			const user = getUserFromResponse(res);
			const items = await repository.getItemByIdAndUserId(resourceId, user.id);
			return ApiResponse.success({ data: items }).send(res);
		},

		async create(req: Request, res: Response) {
			const user = getUserFromResponse(res);

			const body = PatientVisitorResourcesRequests.create.body.parse(req.body);
			const facility = await getAppCtx().medicalFacilityRepository.findByUser(user);
			if (!facility) {
				return ApiResponse.error(AppError.ENTITY_NOT_FOUND()).send(res);
			}
			const newResource = await repository.createForUser({
				...body,
				managerId: user.id,
				facilityId: facility.id,
			});
			return ApiResponse.success({
				data: newResource,
				statusCode: StatusCodes.CREATED,
			}).send(res);
		},

		async update(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { resourceId } = PatientVisitorResourcesRequests.update.params.parse(
				req.params,
			);
			const body = PatientVisitorResourcesRequests.update.body.parse(req.body);
			const resource = await repository.updateForUser(resourceId, {
				...body,
				managerId: user.id,
			});
			return ApiResponse.success({ data: resource }).send(res);
		},

		async delete(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { resourceId } = PatientVisitorResourcesRequests.delete.params.parse(
				req.params,
			);

			await repository.deleteForUser(resourceId, user.id);
			return ApiResponse.success().send(res);
		},
	};
}
