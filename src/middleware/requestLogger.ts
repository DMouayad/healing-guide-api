import { env } from "@/common/utils/envConfig";
import morgan from "morgan";
export const requestLogger = morgan(env.isDevelopment ? "dev" : "combined", {
	skip(req, res) {
		return res.statusCode < 400;
	},
});
