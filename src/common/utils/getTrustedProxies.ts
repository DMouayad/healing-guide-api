import { env } from "./envConfig";

export function getTrustedProxiesFromEnv(): string[] {
	const envValue = env.TRUSTED_PROXIES;

	// Split the environment variable value by commas and trim whitespace
	return envValue.split(",").map((proxy) => proxy.trim());
}
