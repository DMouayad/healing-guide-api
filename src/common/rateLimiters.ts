import { RateLimiterMemory, type RateLimiterRes } from "rate-limiter-flexible";
import type { RateLimitConfig } from "./types";
import { env } from "./utils/envConfig";

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
	return res?.msBeforeNext ? Math.round(res.msBeforeNext / 1000) || 1 : undefined;
}
