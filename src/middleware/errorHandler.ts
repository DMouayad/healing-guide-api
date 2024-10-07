import AppError from "@/common/models/appError";
import { APP_ERR_CODES } from "@/common/models/errorCodes";
import type { ApiResponse } from "@/common/types";
import { env } from "@/common/utils/envConfig";
import { logger } from "@utils/logger";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import "http-status-codes";
import { ZodError } from "zod";

const notImportantCodes = [
	StatusCodes.BAD_REQUEST,
	StatusCodes.FORBIDDEN,
	StatusCodes.UNAUTHORIZED,
	StatusCodes.NOT_FOUND,
	StatusCodes.UNPROCESSABLE_ENTITY,
	StatusCodes.REQUEST_TIMEOUT,
];

export const unexpectedRequestHandler: RequestHandler = (req, res) => {
	logger.warn(`${req.method} Request made to unknown route: ${req.url}`);
	res.status(StatusCodes.NOT_FOUND).send();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const shouldLogError = env.isDevelopment || (env.isProduction && shouldLogErrorInProduction(err));
	err.stack = isAppErr(err) ? refineStackTrace(err.stack) : err.stack;
	if (shouldLogError) {
		logger.error(err);
	}
	err.stack = undefined; // it's important to set the stack as undefined so it won't be included in the response
	// construct a response based on the error
	const appError = convertToAppError(err);
	res.status(appError.status).json(appError.toApiResponse());
};
function convertToAppError(err: any): AppError {
	if (isZodError(err)) {
		const validationErr = AppError.VALIDATION({ message: JSON.stringify(err.format()) });
		return validationErr;
	}
	if (isAppErr(err)) {
		return err;
	}
	const errStatusCode = err.status || err.statusCode || 500;
	const errMessage = errStatusCode === 500 ? "Internal Server Error" : err.message;
	return new AppError(
		errMessage,
		errStatusCode,
		errStatusCode === 500 ? APP_ERR_CODES.SERVER : APP_ERR_CODES.UNKNOWN,
	);
}

function refineStackTrace(trace: string | undefined) {
	if (trace) {
		const stackTraceLines: string[] | undefined = trace.split("\n");
		return stackTraceLines?.slice(3).join("\n");
	}
}
function isAppErr(err: any): err is AppError {
	return err instanceof AppError || (err as AppError).errCode !== undefined;
}
function isZodError(err: any) {
	return err instanceof ZodError;
}
function shouldLogErrorInProduction(err: any): boolean {
	return notImportantCodes.includes(err.status) || notImportantCodes.includes(err.params.status);
}
