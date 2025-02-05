import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SignatureError } from "signed";
import ApiResponse from "src/common/models/apiResponse";
import AppError, { RateLimitError } from "src/common/models/appError";
import { APP_ERR_CODES } from "src/common/models/errorCodes";
import { logErrIfNeeded } from "src/common/utils/logger";
import { toAppError } from "src/common/utils/toAppError";
import { passwordResetRoutes } from "src/passwordReset/passwordReset.router";

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

export function handleInvalidPasswordReset(
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (
		(err instanceof AppError && err.errCode === APP_ERR_CODES.INVALID_PASSWORD_RESET) ||
		err instanceof SignatureError
	) {
		if (req.accepts("html")) {
			res.redirect(passwordResetRoutes.passwordResetInvalid);
		} else {
			ApiResponse.error(AppError.INVALID_PASSWORD_RESET()).send(res);
		}
		return;
	} else if (err) {
		console.log(err);
		return next(err);
	}
	next();
}
