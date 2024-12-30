import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
	NODE_ENV: str({
		devDefault: testOnly("test"),
		choices: ["development", "production", "test"],
	}),
	ZOHO_EMAIL: str(),
	ZOHO_PASSWORD: str(),
	DEFAULT_OTP_LENGTH: num({ devDefault: 7 }),
	EMAIL_VERIFICATION_CODE_LENGTH: num({ devDefault: 7 }),
	PHONE_VERIFICATION_CODE_LENGTH: num({ devDefault: 7 }),
	IDENTITY_CONFIRMATION_CODE_LENGTH: num({ devDefault: 7 }),
	SIGNUP_CODE_LENGTH: num({ devDefault: 6 }),
	SIGNUP_CODE_EXPIRATION: num({ desc: "Signup code expiration in minutes" }),
	HOST: host({ devDefault: "localhost" }),
	PORT: port({ devDefault: 8080 }),
	CORS_ORIGIN: str({ devDefault: "http://localhost:8080" }),
	COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 100 }),
	COMMON_RATE_LIMIT_WINDOW_MINUTES: num({ devDefault: 15 }),
	DATABASE_URL: str({
		example: "postgres://username:password@yourdomain.com/database",
	}),
	PERSONAL_ACCESS_TOKEN_EXPIRATION: num({ desc: "Token expiration in minutes" }),
	EMAIL_VERIFICATION_CODE_EXPIRATION: num({
		desc: "Email verification code expiration in minutes",
	}),
	PHONE_VERIFICATION_CODE_EXPIRATION: num({
		desc: "Phone number verification code expiration in minutes",
	}),
	IDENTITY_CONFIRMATION_CODE_EXPIRATION: num({
		desc: "Identity confirmation code expiration in minutes",
	}),
	IDENTITY_CONFIRMATION_TIME_WINDOW: num({
		desc: "The time window in which the user considered identified",
		devDefault: 60,
	}),
	APP_URL: str({ devDefault: "http://localhost:8080" }),
	API_VERSION: str(),
	ADMIN_EMAIL: str(),
	ADMIN_PHONE: str(),
	ADMIN_PASSWORD: str(),
	DEFAULT_PER_PAGE: num({ devDefault: 15 }),
});
