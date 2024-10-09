import { toAppError } from "@/common/utils/toAppError";
import { logErrIfNeeded, logger } from "@utils/logger";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import "http-status-codes";

export const unexpectedRequestHandler: RequestHandler = (req, res) => {
	logger.warn(`${req.method} Request made to unknown route: ${req.url}`);
	res.status(StatusCodes.NOT_FOUND).send();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const appError = toAppError(err);
	logErrIfNeeded(appError);

	appError.stack = undefined; // set to undefined so it won't end up out in the public
	// construct a response based on the error
	res.status(appError.status).json(appError.toApiResponse());
};
