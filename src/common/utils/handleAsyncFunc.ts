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
	onSuccess: (result: T) => SuccessResponse;
	onResultUndefined: () => AppError;
};
export async function handleAsyncFunc<T>({
	res,
	resultPromise,
	onSuccess,
	onResultUndefined,
}: handleAsyncFuncParams<T>): Promise<void> {
	const result = await resultPromise;
	if (result === undefined) {
		throw onResultUndefined();
	}
	const successResponse = onSuccess(result);
	if (successResponse.statusCode === undefined) {
		successResponse.statusCode = StatusCodes.OK;
	}
	res.status(successResponse.statusCode).json({
		message: successResponse.message ?? "success",
		statusCode: successResponse.statusCode,
		data: successResponse.responseData,
	});
}
