import AppError from "@/common/models/appError";
import type { IUser } from "@/interfaces/IUser";
import type { NextFunction, Request, Response } from "express";

export async function activated(req: Request, res: Response, next: NextFunction) {
	const currentUser: IUser | undefined = res.locals.authState?.user;
	if (!currentUser) {
		throw AppError.UNAUTHORIZED();
	}
	if (!currentUser.activated) {
		throw AppError.FORBIDDEN();
	}
	next();
}
