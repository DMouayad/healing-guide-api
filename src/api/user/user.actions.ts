import { UserResource } from "@/api/user/user.resource";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { APP_ROLES } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import type { IUser } from "@/interfaces/IUser";
import type { Request, Response } from "express";
import { getUserFromResponse } from "../auth/utils";
import { userRequests } from "./user.requests";

export async function deleteUserAction(req: Request, res: Response) {
	const currentUser: IUser | undefined = res.locals.auth?.user;
	if (!currentUser) {
		throw AppError.UNAUTHENTICATED();
	}
	return getAppCtx()
		.userRepository.delete(currentUser)
		.then(checkUser)
		.then((_) => ApiResponse.success().send(res));
}

export function getNonAdminUsersAction(req: Request, res: Response) {
	return getAppCtx()
		.userRepository.getWithRoles([
			APP_ROLES.facilityManager,
			APP_ROLES.patient,
			APP_ROLES.physician,
		])
		.then((users) => ApiResponse.success({ data: users.map(UserResource.create) }))
		.then((apiResponse) => apiResponse.send(res));
}

export async function updateUserActivationStatus(req: Request, res: Response) {
	const data = await userRequests.updateActivation.parseAsync({ params: req.params });
	return getAppCtx()
		.userRepository.updateById(data.params.id, data.body)
		.then(checkUser)
		.then((user) => {
			return user.activated
				? ApiResponse.success()
				: ApiResponse.error(AppError.SERVER_ERROR());
		})
		.then((apiResponse) => apiResponse.send(res));
}
export async function updateUser(req: Request, res: Response) {
	const data = await userRequests.update.parseAsync({
		params: req.params,
		body: req.body,
	});
	const user = getUserFromResponse(res);

	return checkUser(user)
		.then((user) => getAppCtx().userRepository.update(user, data.body))
		.then((user) => ApiResponse.success({ data: UserResource.create(user!) }))
		.then((apiResponse) => apiResponse.send(res));
}

function checkUser(user: IUser | undefined) {
	return user ? Promise.resolve(user) : Promise.reject(AppError.ENTITY_NOT_FOUND());
}
