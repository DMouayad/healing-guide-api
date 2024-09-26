import AppError from "@/common/models/appError";
import { env } from "@/common/utils/envConfig";
import { logger } from "@utils/logger";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import "http-status-codes";

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
	if (err instanceof AppError) {
		res.status(err.status).json(err);
	} else {
		res.status(err.status || 500).send(err.message);
	}
	if (env.isDevelopment) {
		logger.error(err);
	} else if (env.isProduction && shouldLogErrorInProduction(err)) {
		logger.error(err);
	}
};
function shouldLogErrorInProduction(err: any): boolean {
	return notImportantCodes.includes(err.status) || notImportantCodes.includes(err.params.status);
}
