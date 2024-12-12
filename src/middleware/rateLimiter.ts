import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";

import { env } from "@/common/utils/envConfig";

const rateLimiter = (
	limit?: number,
	windowMin?: number,
	keyGenerator?: (req: Request, res: Response) => string,
) =>
	rateLimit({
		legacyHeaders: true,
		limit: limit ?? env.COMMON_RATE_LIMIT_MAX_REQUESTS,
		windowMs: (windowMin ?? env.COMMON_RATE_LIMIT_WINDOW_MINUTES) * 60 * 1000,
		message: "Too many requests, please try again later.",
		standardHeaders: true,
		validate: true,
		keyGenerator: (req, res) =>
			keyGenerator ? keyGenerator(req, res) : (req.ip as string),
	});

export default rateLimiter;
