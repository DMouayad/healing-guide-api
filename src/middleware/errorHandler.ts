import { APP_ERR_CODES } from "@/common/models/errorCodes";
import { passwordResetRoutes } from "@/passwordReset/passwordReset.router";
import ApiResponse from "@common/models/apiResponse";
import AppError, { RateLimitError } from "@common/models/appError";
import { toAppError } from "@common/utils/toAppError";
import { logErrIfNeeded } from "@utils/logger";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { SignatureError } from "signed";

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
