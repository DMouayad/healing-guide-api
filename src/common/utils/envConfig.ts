import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
	NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
	HOST: host({ devDefault: "localhost" }),
	PORT: port({ devDefault: 8080 }),
	CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
	COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: 1000 }),
	COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: 1000 }),
	DATABASE_URL: str({ example: "postgres://username:password@yourdomain.com/database" }),
	PERSONAL_ACCESS_TOKEN_EXPIRATION: num({ desc: "Token expiration in minutes" }),
	ADMIN_EMAIL: str(),
	ADMIN_PHONE: str(),
	ADMIN_PASSWORD: str(),
});
