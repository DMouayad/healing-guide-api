import AppError from "@/common/models/appError";
import { env } from "@/common/utils/envConfig";
import { logger } from "@utils/logger";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import "http-status-codes";
import type { ZodError } from "zod";

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
	const stackTrace = refineStackTrace(err.stack);
	err.stack = undefined; // it's important to set the stack as undefined so it won't be visible in the response
	if (isZodError(err)) {
		const validationErr = AppError.VALIDATION({ message: JSON.stringify(err.format()) });
		res.status(validationErr.status).json(validationErr);
	}
	if (isAppErr(err)) {
		res.status(err.status).json(err);
	} else {
		const errStatusCode = err.status || err.statusCode || 500;
		const errMessage = errStatusCode === 500 ? "Internal Server Error" : err.message;
		res.status(errStatusCode).json({ message: errMessage });
	}
	const shouldLogError = env.isDevelopment || (env.isProduction && shouldLogErrorInProduction(err));

	if (shouldLogError) {
		logger.error(err);
		logger.error(`Stack trace: Error\n${stackTrace}`);
	}
};
function refineStackTrace(trace: string | undefined) {
	if (trace) {
		const stackTraceLines: string[] | undefined = trace.split("\n");
		return stackTraceLines?.slice(3).join("\n");
	}
}
function isAppErr(err: any): err is AppError {
	return (err as AppError).errCode !== undefined;
}
function isZodError(err: any): err is ZodError {
	return err.format !== undefined;
}
function shouldLogErrorInProduction(err: any): boolean {
	return notImportantCodes.includes(err.status) || notImportantCodes.includes(err.params.status);
}
