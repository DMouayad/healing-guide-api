import { getUserFromResponse } from "@/api/auth/utils";
import ApiResponse from "@/common/models/apiResponse";
import { getRetryAfterSecs } from "@/common/rateLimiters";
import type { NextFunction, Request, Response } from "express";
import type { RateLimiterAbstract } from "rate-limiter-flexible";

export default (limiter: RateLimiterAbstract) =>
	(req: Request, res: Response, next: NextFunction) => {
		const user = getUserFromResponse(res);
		const key = user.id;
		limiter
			.consume(key)
			.then((_) => next())
			.catch(async (_) => {
				const rateLimitRes = await limiter.get(key);
				return ApiResponse.rateLimited({
					retryAfterSecs: getRetryAfterSecs(rateLimitRes),
				}).send(res);
			});
	};
