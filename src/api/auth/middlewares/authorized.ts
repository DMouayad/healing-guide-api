import AppError from "@/common/models/appError";
import type { Role } from "@/common/types";
import type { NextFunction, Request, Response } from "express";
import { getUserFromResponse } from "../utils";

export function authorized(role: Role) {
	return (_: Request, res: Response, next: NextFunction) => {
		const user = getUserFromResponse(res);

		if (user.isAuthorizedAs(role)) {
			next();
		}
		throw AppError.FORBIDDEN();
	};
}
export function authorizedAsAny(roles: Role[]) {
	return (_: Request, res: Response, next: NextFunction) => {
		const user = getUserFromResponse(res);

		if (user.isAuthorizedAsAny(roles)) {
			next();
		}
		throw AppError.FORBIDDEN();
	};
}
