import type { Response } from "express";
import type { ActionResult } from "../models/actionResult";
import AppError from "../models/appError";
import { logErrIfNeeded, logger } from "./logger";
import { toAppError } from "./toAppError";

type handleActionParams<T> = {
	res: Response;
	resultPromise: Promise<T | undefined>;
	onResult: (result: T) => ActionResult;
	onResultUndefinedThrow?: () => AppError;
	onCatchError?: (err: AppError) => ActionResult | AppError;
};
export async function handleAction<T>(params: handleActionParams<T>): Promise<void> {
	let response: AppError | ActionResult;
	try {
		const result = await params.resultPromise;
		if (result === undefined) {
			if (params.onResultUndefinedThrow) {
				throw params.onResultUndefinedThrow();
			}
			// if `undefined` result not handled
			logger.warn(`Unexpected 'undefined' result`);
			response = AppError.SERVER_ERROR();
		} else {
			response = params.onResult(result);
		}
	} catch (err) {
		if (params.onCatchError) {
			const appErr = toAppError(err);
			logErrIfNeeded(appErr);
			response = params.onCatchError(appErr);
		} else {
			throw err;
		}
	}
	params.res.status(response.statusCode).json(response.toApiResponse());
}
