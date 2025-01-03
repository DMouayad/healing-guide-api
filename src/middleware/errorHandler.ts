import ApiResponse from "@/common/models/apiResponse";
import { RateLimitError } from "@/common/models/appError";
import { toAppError } from "@/common/utils/toAppError";
import { logErrIfNeeded, logger } from "@utils/logger";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

export const unexpectedRequestHandler: RequestHandler = (req, res) => {
	logger.warn(`${req.method} Request made to unknown route: ${req.url}`);
	res.status(StatusCodes.NOT_FOUND).send();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof RateLimitError) {
		if (err.retryAfterSecs) {
			res.set("Retry-After", err.retryAfterSecs.toString());
		}
		res.status(StatusCodes.TOO_MANY_REQUESTS).send("Too Many Requests");
	} else {
		const appError = toAppError(err);
		logErrIfNeeded(appError);
		ApiResponse.error(appError).send(res);
	}
};
