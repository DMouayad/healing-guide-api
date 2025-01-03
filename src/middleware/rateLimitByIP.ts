import ApiResponse from "@/common/models/apiResponse";
import { getRetryAfterSecs } from "@/common/rateLimiters";
import { getClientIp } from "@/common/utils/getClientIp";
import { logger } from "@/common/utils/logger";
import type { NextFunction, Request, Response } from "express";
import type { RateLimiterAbstract } from "rate-limiter-flexible";

export default (limiter: RateLimiterAbstract) =>
	(req: Request, res: Response, next: NextFunction) => {
		const clientIP = getClientIp(req);
		if (!clientIP) {
			logger.warn(
				"Could not determine client IP for request. Bypassing default rate limiter by IP",
			);
			next();
		} else {
			limiter
				.consume(clientIP)
				.then((_) => next())
				.catch(async (_) => {
					const rateLimitRes = await limiter.get(clientIP);
					return ApiResponse.rateLimited({
						retryAfterSecs: getRetryAfterSecs(rateLimitRes),
					}).send(res);
				});
		}
	};
