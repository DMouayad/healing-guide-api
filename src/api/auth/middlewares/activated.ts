import AppError from "@/common/models/appError";
import type { IUser } from "@/interfaces/IUser";
import type { NextFunction, Request, Response } from "express";

export async function activated(_req: Request, res: Response, next: NextFunction) {
	const user: IUser | undefined = res.locals.auth?.user;
	if (!user) {
		throw AppError.UNAUTHORIZED();
	}
	if (!user.activated) {
		throw AppError.FORBIDDEN();
	}
	next();
}
