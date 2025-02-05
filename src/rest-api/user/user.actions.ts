import type { Request, Response } from "express";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import { APP_ROLES } from "src/common/types";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { UserResource } from "src/rest-api/user/user.resource";
import { getUserFromResponse } from "../auth/utils";
import { userRequests } from "./user.requests";

export async function deleteUserAction(req: Request, res: Response) {
	const currentUser = getUserFromResponse(res);
	return getAppCtx()
		.userRepository.delete(currentUser)
		.then((_) => ApiResponse.success().send(res));
}

export function getNonAdminUsersAction(req: Request, res: Response) {
	return getAppCtx()
		.userRepository.getWithRoles([
			APP_ROLES.facilityManager,
			APP_ROLES.patient,
			APP_ROLES.physician,
		])
		.then((users) => ApiResponse.success({ data: users.map(UserResource) }))
		.then((apiResponse) => apiResponse.send(res));
}

export async function updateUserActivationStatus(req: Request, res: Response) {
	const data = await userRequests.updateActivation.parseAsync({ params: req.params });
	return getAppCtx()
		.userRepository.updateById(data.params.id, data.body)
		.then((user) => {
			return user?.activated
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

	return getAppCtx()
		.userRepository.update(user, data.body)
		.then((user) => ApiResponse.success({ data: UserResource(user!) }))
		.then((apiResponse) => apiResponse.send(res));
}
