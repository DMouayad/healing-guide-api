import type { NextFunction, Request, Response } from "express";
import { type RateLimiterAbstract, RateLimiterRes } from "rate-limiter-flexible";
import AppError from "src/common/models/appError";
import { getRetryAfterSecs } from "src/common/rateLimiters";
import { getClientIp } from "src/common/utils/getClientIp";
import { commonZodSchemas } from "src/common/zod/common";
import {
	forgotPasswordRequest,
	resetPasswordRequest,
} from "src/passwordReset/passwordReset.types";
import { getUserFromResponse } from "src/rest-api/auth/utils";
import { z } from "zod";

function baseRateLimiter(limiter: RateLimiterAbstract, key?: string | number) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!key) {
			next();
		} else {
			return limiter
				.consume(key)
				.then((_) => next())
				.catch(async (err) => {
					if (err instanceof RateLimiterRes) {
						const retryAfterSecs = getRetryAfterSecs(err);
						next(AppError.RATE_LIMIT_EXCEEDED({ retryAfterSecs }));
					} else {
						next(err);
					}
				});
		}
	};
}

export function rateLimiterByIP(limiter: RateLimiterAbstract) {
	return (req: Request, res: Response, next: NextFunction) => {
		return baseRateLimiter(limiter, getClientIp(req))(req, res, next);
	};
}
export function rateLimiterByUser(limiter: RateLimiterAbstract) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = getUserFromResponse(res);
		return baseRateLimiter(limiter, user.id)(req, res, next);
	};
}
export function rateLimiterByEmailAndPhone(limiter: RateLimiterAbstract) {
	return (req: Request, res: Response, next: NextFunction) => {
		const creds = CredentialsForRateLimitSchema.parse(req.body);
		const key = getCredsRateLimitingKey(creds);
		return baseRateLimiter(limiter, key)(req, res, next);
	};
}
export function forgotPasswordRateLimiterByCreds(limiter: RateLimiterAbstract) {
	return (req: Request, res: Response, next: NextFunction) => {
		const validationResult = forgotPasswordRequest.body.safeParse(req.body);
		if (!validationResult.success) {
			return res.redirect("/404");
		}
		const data = validationResult.data;
		const key = data.receiveVia === "MAIL" ? data.email : data.phone;
		console.log(key);
		if (!key) {
			return next();
		}
		return baseRateLimiter(limiter, key)(req, res, next);
	};
}
export function passwordResetRateLimiterByToken(limiter: RateLimiterAbstract) {
	return (req: Request, res: Response, next: NextFunction) => {
		const validationResult = resetPasswordRequest.params.safeParse(req.params);
		if (!validationResult.success) {
			return res.redirect("/404");
		}
		const key = validationResult.data.token;

		try {
			return baseRateLimiter(limiter, key)(req, res, next);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export const CredentialsForRateLimitSchema = z.object({
	email: z.string().email().nullable().optional(),
	phoneNumber: commonZodSchemas.phoneNumber,
});
export type CredentialsForRateLimit = z.infer<typeof CredentialsForRateLimitSchema>;

export function getCredsRateLimitingKey(creds: CredentialsForRateLimit) {
	return creds.phoneNumber + (creds.email ? `_${creds.email}` : "");
}
