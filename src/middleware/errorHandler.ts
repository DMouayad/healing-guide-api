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

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
	if (env.isDevelopment) {
		logger.error(err);
	} else if (env.isProduction && shouldLogErrorInProduction(err)) {
		logger.error(err);
	}
};
function isAppErr(err: any): err is AppError {
	return (err as AppError).errCode !== undefined;
}
function isZodError(err: any): err is ZodError {
	return err.format !== undefined;
}
function shouldLogErrorInProduction(err: any): boolean {
	return notImportantCodes.includes(err.status) || notImportantCodes.includes(err.params.status);
}
