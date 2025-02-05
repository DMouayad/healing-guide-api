import type { NextFunction, Request, Response } from "express";
import AppError from "src/common/models/appError";
import { APP_ROLES } from "src/common/types";
import type { IUser } from "src/interfaces/IUser";

export async function isAdmin(_req: Request, res: Response, next: NextFunction) {
	const user: IUser | undefined = res.locals.auth?.user;

	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (user.activated && user.isAuthorizedAs(APP_ROLES.admin)) {
		next();
	}
	throw AppError.FORBIDDEN();
}
