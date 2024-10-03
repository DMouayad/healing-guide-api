import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type AppError from "../models/appError";

type SuccessResponse = {
	message?: string;
	statusCode?: number;
	responseData?: object;
};
type handleAsyncFuncParams<T> = {
	res: Response;
	resultPromise: Promise<T | undefined>;
	onResult: (result: T) => SuccessResponse;
	onResultUndefinedThrow: () => AppError;
};
export async function handleAsyncFunc<T>({
	res,
	resultPromise,
	onResult,
	onResultUndefinedThrow,
}: handleAsyncFuncParams<T>): Promise<void> {
	const result = await resultPromise;
	if (result === undefined) {
		throw onResultUndefinedThrow();
	}
	const successResponse = onResult(result);
	if (successResponse.statusCode === undefined) {
		successResponse.statusCode = StatusCodes.OK;
	}
	res.status(successResponse.statusCode).json({
		message: successResponse.message ?? "success",
		statusCode: successResponse.statusCode,
		data: successResponse.responseData,
	});
}
