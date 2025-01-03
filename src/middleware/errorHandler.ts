import ApiResponse from "@/common/models/apiResponse";
import { getRetryAfterSecs } from "@/common/rateLimiters";
import { toAppError } from "@/common/utils/toAppError";
import { logErrIfNeeded, logger } from "@utils/logger";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { RateLimiterRes } from "rate-limiter-flexible";

export const unexpectedRequestHandler: RequestHandler = (req, res) => {
	logger.warn(`${req.method} Request made to unknown route: ${req.url}`);
	res.status(StatusCodes.NOT_FOUND).send();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof RateLimiterRes) {
		ApiResponse.rateLimited({ retryAfterSecs: getRetryAfterSecs(err) }).send(res);
	} else {
		const appError = toAppError(err);
		logErrIfNeeded(appError);
		// send a json response containing the error
		ApiResponse.error(appError).send(res);
	}
};
