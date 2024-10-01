import AppError from "@/common/models/appError";
import type { NextFunction, Request, Response } from "express";

function skipRequest(req: Request) {
	return !["POST", "PUT", "PATCH"].includes(req.method);
}
const VALID_TYPES = ["application/json", "multipart/form-data"];

function isValidContentType(value: string | string[]): boolean {
	if (typeof value === "string") {
		return VALID_TYPES.includes(value.toLowerCase());
	}
	return value.every((type) => VALID_TYPES.includes(type.toLowerCase()));
}
export const hasValidContentType = (req: Request, _res: Response, next: NextFunction) => {
	const contentType = req.headers["Content-Type"] || req.headers["content-type"];
	if (skipRequest(req)) {
		return next();
	}
	if (contentType && isValidContentType(contentType)) {
		return next();
	}
	throw AppError.UNSUPPORTED_MEDIA_TYPE({ description: `Content-type "${contentType}" is not supported` });
};
