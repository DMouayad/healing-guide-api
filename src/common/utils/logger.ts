import { StatusCodes } from "http-status-codes";
import pino from "pino";
import type AppError from "../models/appError";
import { env } from "./envConfig";

export const logger = pino();

const notImportantCodes = [
	StatusCodes.BAD_REQUEST,
	StatusCodes.FORBIDDEN,
	StatusCodes.UNAUTHORIZED,
	StatusCodes.NOT_FOUND,
	StatusCodes.UNPROCESSABLE_ENTITY,
	StatusCodes.REQUEST_TIMEOUT,
];

export function logErrIfNeeded(err: AppError) {
	const shouldLogError =
		env.isDevelopment || (env.isProduction && logErrorInProduction(err));
	if (shouldLogError) {
		logger.error(err);
	}
}

function logErrorInProduction(err: AppError): boolean {
	return notImportantCodes.includes(err.statusCode);
}
