import { memoryRateLimiter } from "src/common/rateLimiters";
import { env } from "src/common/utils/envConfig";

export const passwordResetRateLimits = {
	forgotPassword: {
		byIP: memoryRateLimiter(
			"forgot_password_by_IP",
			env.FORGOT_PASSWORD_RATE_LIMIT.byIP,
		),
		byCredentials: memoryRateLimiter(
			"forgot_password_by_credentials",
			env.FORGOT_PASSWORD_RATE_LIMIT.byCredentials,
		),
	},
	resetPassword: {
		byIP: memoryRateLimiter("reset_password_by_IP", env.RESET_PASSWORD_RATE_LIMIT.byIP),
		byCredentials: memoryRateLimiter(
			"reset_password_by_credentials",
			env.RESET_PASSWORD_RATE_LIMIT.byCredentials,
		),
	},
};
