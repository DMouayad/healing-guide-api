import ApiResponse from "@/common/models/apiResponse";
import { getRetryAfterSecs } from "@/common/rateLimiters";
import { commonZodSchemas } from "@/common/zod/common";
import type { NextFunction, Request, Response } from "express";
import type { RateLimiterAbstract } from "rate-limiter-flexible";
import { z } from "zod";

export const CredentialsForRateLimitSchema = z.object({
	email: z.string().email().optional(),
	phoneNumber: commonZodSchemas.phoneNumber,
});
export type CredentialsForRateLimit = z.infer<typeof CredentialsForRateLimitSchema>;

export function getCredsRateLimitingKey(creds: CredentialsForRateLimit) {
	return creds.phoneNumber + (creds.email ? `_${creds.email}` : "");
}
export default (limiter: RateLimiterAbstract) =>
	(req: Request, res: Response, next: NextFunction) => {
		const creds = CredentialsForRateLimitSchema.parse(req.body);
		const key = getCredsRateLimitingKey(creds);
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
