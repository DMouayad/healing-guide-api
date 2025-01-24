import AppError from "@/common/models/appError";
import type { IUser } from "@/interfaces/IUser";
import ApiResponse from "@common/models/apiResponse";
import { getAppCtx } from "@common/utils/getAppCtx";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserFromResponse } from "../auth/utils";
import {
	type CreateFacilityResourceDTO,
	FacilityResourcesRequests,
} from "./facilityResources.types";

export function createFacilityResourceActions() {
	const { facilityResourcesRepository: repository, medicalFacilityRepository } =
		getAppCtx();

	async function verifyFacilityOwnership(facilityId: number, user: IUser) {
		const facility = await medicalFacilityRepository.findByUser(user);

		if (!facility || facility.id !== facilityId) {
			throw AppError.FORBIDDEN();
		}

		return facility;
	}

	return {
		async getFacilityResources(req: Request, res: Response) {
			const { facilityId } = FacilityResourcesRequests.getByFacilityId.params.parse(
				req.params,
			);
			const resources = await repository.getByFacilityId(facilityId);
			return ApiResponse.success({ data: resources }).send(res);
		},

		async getResourceById(req: Request, res: Response) {
			const { resourceId } = FacilityResourcesRequests.getById.params.parse(req.params);
			const resource = await repository.getById(resourceId);
			return ApiResponse.success({ data: resource }).send(res);
		},

		async createResource(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { facilityId } = FacilityResourcesRequests.create.params.parse(req.params);
			await verifyFacilityOwnership(facilityId, user);

			const body = FacilityResourcesRequests.create.body.parse(req.body);
			const dto: CreateFacilityResourceDTO = {
				facilityId: facilityId,
				categoryId: body.categoryId,
				content: body.content,
				title: body.title,
			};
			const newResource = await repository.create(dto);
			return ApiResponse.success({
				data: newResource,
				statusCode: StatusCodes.CREATED,
			}).send(res);
		},

		async updateResource(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { resourceId } = FacilityResourcesRequests.update.params.parse(req.params);

			// Get the resource to check facility ownership
			const existingResource = await repository.getById(resourceId);
			if (!existingResource) {
				return ApiResponse.error(AppError.ENTITY_NOT_FOUND()).send(res);
			}

			await verifyFacilityOwnership(existingResource.facilityId, user);

			const body = FacilityResourcesRequests.update.body.parse(req.body);
			const resource = await repository.update(resourceId, body);
			return ApiResponse.success({ data: resource }).send(res);
		},

		async deleteResource(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { resourceId } = FacilityResourcesRequests.delete.params.parse(req.params);

			// Get the resource to check facility ownership
			const existingResource = await repository.getById(resourceId);
			if (!existingResource) {
				return ApiResponse.error(AppError.ENTITY_NOT_FOUND()).send(res);
			}

			await verifyFacilityOwnership(existingResource.facilityId, user);

			await repository.delete(resourceId);
			return ApiResponse.success().send(res);
		},
	};
}
