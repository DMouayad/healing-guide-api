import { getUserFromResponse } from "@/api/auth/utils";
import AppError from "@/common/models/appError";
import { getRetryAfterSecs } from "@/common/rateLimiters";
import { getClientIp } from "@/common/utils/getClientIp";
import { commonZodSchemas } from "@/common/zod/common";
import type { NextFunction, Request, Response } from "express";
import { type RateLimiterAbstract, RateLimiterRes } from "rate-limiter-flexible";
import { z } from "zod";

function baseRateLimiter(limiter: RateLimiterAbstract, key?: string | number) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!key) {
			next();
		} else {
			limiter
				.consume(key)
				.then((_) => next())
				.catch(async (err) => {
					if (err instanceof RateLimiterRes) {
						const retryAfterSecs = getRetryAfterSecs(err);
						throw AppError.RATE_LIMIT_EXCEEDED({ retryAfterSecs });
					}
					return Promise.reject(err);
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

export const CredentialsForRateLimitSchema = z.object({
	email: z.string().email().optional(),
	phoneNumber: commonZodSchemas.phoneNumber,
});
export type CredentialsForRateLimit = z.infer<typeof CredentialsForRateLimitSchema>;

export function getCredsRateLimitingKey(creds: CredentialsForRateLimit) {
	return creds.phoneNumber + (creds.email ? `_${creds.email}` : "");
}
