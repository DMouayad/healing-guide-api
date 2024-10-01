import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { handleAsyncFunc } from "@/common/utils/handleAsyncFunc";
import type { Request, Response } from "express";
import { userRequests } from "./user.requests";

async function deleteUser(req: Request, res: Response) {
	const data = userRequests.delete.parse({ params: req.params });
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userService.deleteUserById(data.params.id),
		onSuccess: (_) => ({ message: "User was deleted successfully" }),
		onResultUndefined: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

async function getUser(req: Request, res: Response) {
	const data = userRequests.get.parse({ params: req.params });
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userService.getUserById(data.params.id),
		onSuccess: (user) => ({ responseData: user }),
		onResultUndefined: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}
async function updateUser(req: Request, res: Response) {
	const data = userRequests.update.parse({ params: req.params });
	const { fullName, email, phoneNumber } = data.body;
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userService.updateUserById(data.params.id, fullName, email, phoneNumber),
		onSuccess: (user) => ({ message: "User was updated successfully", responseData: user }),
		onResultUndefined: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

export const userActions = {
	get: getUser,
	update: updateUser,
	delete: deleteUser,
};
