import AppError from "@/common/models/appError";
import type { Role } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";
import type { NextFunction, Request, Response } from "express";

export function authorized(role: Role) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user: IUser | undefined = res.locals.auth?.user;
		if (!user) {
			throw AppError.UNAUTHENTICATED();
		}
		if (user.isAuthorizedAs(role)) {
			next();
		}
		throw AppError.FORBIDDEN();
	};
}
export function authorizedAsAny(roles: Role[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user: IUser | undefined = res.locals.auth?.user;
		if (!user) {
			throw AppError.UNAUTHENTICATED();
		}
		if (user.isAuthorizedAsAny(roles)) {
			next();
		}
		throw AppError.FORBIDDEN();
	};
}
