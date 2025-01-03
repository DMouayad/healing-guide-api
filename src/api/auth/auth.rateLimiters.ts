import { memoryRateLimiter } from "@/common/rateLimiters";
import { env } from "@/common/utils/envConfig";

export const authRateLimits = {
	sendSignupCode: {
		byIP: memoryRateLimiter(
			"request_signup_code_limit_by_IP",
			env.SEND_OTP_RATE_LIMIT.byIP,
		),
		byCredentials: memoryRateLimiter(
			"request_signup_code_limit_by_user",
			env.SEND_OTP_RATE_LIMIT.byCredentials,
		),
	},
	login: {
		byIP: memoryRateLimiter("login_limit_by_IP", env.LOGIN_RATE_LIMIT.byIP),
		byCredentials: memoryRateLimiter(
			"login_limit_by_credentials",
			env.LOGIN_RATE_LIMIT.byCredentials,
		),
	},
};
