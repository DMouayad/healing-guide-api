import AppError from "@common/models/appError";
import type { NextFunction, Request, Response } from "express";

export const hasRequestBody = (req: Request, _res: Response, next: NextFunction) => {
	if (skipRequest(req)) {
		return next();
	}
	if (req.body === undefined) {
		throw AppError.EMPTY_REQUEST_BODY();
	}
	next();
};
function skipRequest(req: Request) {
	return !["POST", "PUT", "PATCH"].includes(req.method);
}
