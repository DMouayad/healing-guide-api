import AppError from "@/common/models/appError";
import { APP_ROLES } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { handleAsyncFunc } from "@/common/utils/handleAsyncFunc";
import { UserResource } from "@/resources/userResource";
import type { Request, Response } from "express";
import { userRequests } from "./user.requests";

export async function deleteUserAction(req: Request, res: Response) {
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.delete(res.locals.auth.user),
		onResult: (_) => ({ message: "User was deleted successfully" }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

async function getUser(req: Request, res: Response) {
	const data = await userRequests.get.parseAsync({ params: req.params });
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.find(data.params.id),
		onResult: (user) => ({ responseData: UserResource.create(user) }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}
export async function getNonAdminUsersAction(req: Request, res: Response) {
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.getWithRoles([
			APP_ROLES.facilityManager,
			APP_ROLES.patient,
			APP_ROLES.physician,
		]),
		onResult: (users) => ({ responseData: users.map(UserResource.create) }),
	});
}

export function updateUserActivationStatus(isActivated: boolean) {
	return (req: Request, res: Response) => {
		return userRequests.changeActivation.parseAsync({ params: req.params }).then(async (data) => {
			await handleAsyncFunc({
				res,
				resultPromise: getAppCtx().userRepository.updateById(data.params.id, {
					activated: isActivated,
				}),
				onResult: (user) => ({
					message: "User was updated successfully",
					responseData: UserResource.create(user),
				}),
				onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
			});
		});
	};
}
export async function updateUser(req: Request, res: Response) {
	const data = await userRequests.update.parseAsync({ params: req.params, body: req.body });
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.update(res.locals.auth.user, data.body),
		onResult: (user) => ({
			message: "User was updated successfully",
			responseData: UserResource.create(user),
		}),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}
