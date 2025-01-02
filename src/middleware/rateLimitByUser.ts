import { getUserFromResponse } from "@/api/auth/utils";
import ApiResponse from "@/common/models/apiResponse";
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
				const info = await limiter.get(key);
				const retryAfterSecs = info?.msBeforeNext
					? Math.floor(info.msBeforeNext / 60)
					: undefined;
				return ApiResponse.rateLimited({ retryAfterSecs }).send(res);
			});
	};
