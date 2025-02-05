import morgan from "morgan";
import { env } from "src/common/utils/envConfig";
export const requestLogger = morgan(env.isDevelopment ? "short" : "combined", {
	skip(_req, res) {
		return res.statusCode < 400;
	},
});
