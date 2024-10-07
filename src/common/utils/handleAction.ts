import type { Response } from "express";
import type { ActionResult } from "../models/actionResult";
import AppError from "../models/appError";

type handleActionParams<T> = {
	res: Response;
	resultPromise: Promise<T | undefined>;
	onResult: (result: T) => ActionResult;
	onResultUndefinedThrow?: () => AppError;
};
export async function handleAction<T>(params: handleActionParams<T>): Promise<void> {
	const result = await params.resultPromise;
	if (result === undefined) {
		if (params.onResultUndefinedThrow) {
			throw params.onResultUndefinedThrow();
		}
		const err = AppError.SERVER_ERROR();
		params.res.status(err.status).json(err.toApiResponse());
	} else {
		const actionResult = params.onResult(result);
		params.res.status(actionResult.statusCode).json(actionResult.toApiResponse());
	}
}
