import { memoryRateLimiter } from "src/common/rateLimiters";
import { env } from "src/common/utils/envConfig";

export default {
	sendEmailVerification: {
		byIP: memoryRateLimiter(
			"Send_Email_verification_IP_limiter",
			env.SEND_OTP_RATE_LIMIT.byIP,
		),
		byUser: memoryRateLimiter(
			"Send_Email_verification_limiter_by_user",
			env.SEND_OTP_RATE_LIMIT.byCredentials,
		),
	},
	verifyEmail: {
		byIP: memoryRateLimiter("verify_email_IP_limiter", env.VERIFY_USER_RATE_LIMIT.byIP),
		byUser: memoryRateLimiter(
			"verify_email_limiter_by_user",
			env.VERIFY_USER_RATE_LIMIT.byCredentials,
		),
	},
	sendPhoneVerification: {
		byIP: memoryRateLimiter(
			"Send_Phone_verification_limiter_by_user",
			env.SEND_OTP_RATE_LIMIT.byIP,
		),
		byUser: memoryRateLimiter(
			"Send_Phone_verification_IP_limiter",
			env.SEND_OTP_RATE_LIMIT.byCredentials,
		),
	},
	verifyPhone: {
		byIP: memoryRateLimiter("verify_phone_IP_limiter", env.VERIFY_USER_RATE_LIMIT.byIP),
		byUser: memoryRateLimiter(
			"verify_phone_limiter_by_user",
			env.VERIFY_USER_RATE_LIMIT.byCredentials,
		),
	},
};
