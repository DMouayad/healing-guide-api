import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import { ActionResult } from "@/common/models/actionResult";

export const handleActionResult = (result: ActionResult<any>, response: Response) => {
	response.status(result.statusCode).send(result);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse({ body: req.body, query: req.query, params: req.params });
		next();
	} catch (err) {
		const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`;
		const statusCode = StatusCodes.BAD_REQUEST;
		const result = ActionResult.failure(errorMessage, null, statusCode);
		return handleActionResult(result, res);
	}
};
