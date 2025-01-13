import AppError from "@common/models/appError";
import { APP_ROLES } from "@common/types";
import type { IUser } from "@interfaces/IUser";
import type { NextFunction, Request, Response } from "express";

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
