import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { handleAsyncFunc } from "@/common/utils/handleAsyncFunc";
import type { Request, Response } from "express";
import { userRequests } from "./user.requests";

async function deleteUser(req: Request, res: Response) {
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.delete(res.locals.auth.user),
		onResult: (_) => ({ message: "User was deleted successfully" }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

async function getUser(req: Request, res: Response) {
	const data = userRequests.get.parse({ params: req.params });
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.find(data.params.id),
		onResult: (user) => ({ responseData: user }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

async function updateUser(req: Request, res: Response) {
	const data = userRequests.update.parse({ params: req.params });
	await handleAsyncFunc({
		res,
		resultPromise: getAppCtx().userRepository.update(res.locals.auth.user, data.body),
		onResult: (user) => ({ message: "User was updated successfully", responseData: user }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

export const userActions = {
	get: getUser,
	update: updateUser,
	delete: deleteUser,
};
