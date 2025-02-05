import type { NextFunction, Request, Response } from "express";
import AppError from "src/common/models/appError";
import type { IUser } from "src/interfaces/IUser";

export async function activated(_req: Request, res: Response, next: NextFunction) {
	const user: IUser | undefined = res.locals.auth?.user;
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (!user.activated) {
		throw AppError.FORBIDDEN();
	}
	next();
}
