import type { NextFunction, Request, Response } from "express";
import AppError from "src/common/models/appError";

function skipRequest(req: Request) {
	return !["POST", "PUT", "PATCH"].includes(req.method);
}
const VALID_TYPES = ["application/json", "application/x-www-form-urlencoded"];

export const hasValidContentType = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	if (skipRequest(req)) {
		return next();
	}
	const reqContentType = req.headers["content-type"];
	if (reqContentType && VALID_TYPES.includes(reqContentType)) {
		return next();
	}
	throw AppError.UNSUPPORTED_MEDIA_TYPE({
		description: `Content-type "${reqContentType}" is not supported`,
	});
};
