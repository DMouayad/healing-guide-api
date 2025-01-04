import type { Request } from "express";
import {
	type RateLimiterAbstract,
	RateLimiterMemory,
	type RateLimiterRes,
} from "rate-limiter-flexible";
import AppError from "./models/appError";
import type { RateLimitConfig } from "./types";
import { env } from "./utils/envConfig";
import { getClientIp } from "./utils/getClientIp";

export type MultipleRateLimiters = {
	byIP: RateLimiterAbstract;
	byCredentials: RateLimiterAbstract;
};

export const memoryRateLimiter = (limiterName: string, config: RateLimitConfig) => {
	return new RateLimiterMemory({
		keyPrefix: limiterName,
		points: config.maxRequests,
		duration: config.resetDuration * 60,
		blockDuration: config.blockDuration ? config.blockDuration * 60 : undefined,
	});
};
export const defaultRateLimiterByIP = memoryRateLimiter(
	"Default_IP_limiter",
	env.API_DEFAULT_RATE_LIMIT,
);

export function getRetryAfterSecs(res: RateLimiterRes | null) {
	return res?.msBeforeNext ? Math.round(res.msBeforeNext / 1000) : undefined;
}
export function consumeByIP(limiter: RateLimiterAbstract, req: Request) {
	const ip = getClientIp(req);

	if (ip) {
		return limiter.consume(ip);
	}
	return Promise.resolve();
}
export async function checkRateLimitsHavePoints(
	req: Request,
	credentialsKey: string,
	limiters: MultipleRateLimiters,
): Promise<void> {
	const ip = getClientIp(req);
	let ipResult: RateLimiterRes | null = null;
	if (ip) {
		ipResult = await limiters.byIP.get(ip);
	}
	const credentialsResult = await limiters.byCredentials.get(credentialsKey);

	let retryAfterSecs = 0;

	if (ipResult && ipResult.remainingPoints <= 0) {
		retryAfterSecs = getRetryAfterSecs(ipResult) ?? 0;
	} else if (credentialsResult && credentialsResult.remainingPoints <= 0) {
		retryAfterSecs = getRetryAfterSecs(credentialsResult) ?? 0;
	}

	if (retryAfterSecs > 0) {
		throw AppError.RATE_LIMIT_EXCEEDED({ retryAfterSecs });
	}
}
