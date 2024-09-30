import { env } from "@/common/utils/envConfig";
import morgan from "morgan";
export const requestLogger = morgan(env.isDevelopment ? "short" : "combined", {
	skip(_req, res) {
		return res.statusCode < 400;
	},
});
