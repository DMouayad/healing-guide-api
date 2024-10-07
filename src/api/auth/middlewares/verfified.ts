import AppError from "@/common/models/appError";
import { APP_ROLES } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";
import type { NextFunction, Request, Response } from "express";

export async function verified(_req: Request, res: Response, next: NextFunction) {
	const user: IUser | undefined = res.locals.auth?.user;
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (checkUserVerification(user)) {
		next();
	}
	throw AppError.FORBIDDEN({ description: "USER NOT VERIFIED" });
}

function checkUserVerification(user: IUser): boolean {
	switch (user.role) {
		case APP_ROLES.guest:
			break;
		case APP_ROLES.facilityManager:
		case APP_ROLES.admin:
			{
				const userVerified =
					verifiedAtDateIsValid(user.emailVerifiedAt) &&
					verifiedAtDateIsValid(user.phoneNumberVerifiedAt);
				if (!userVerified) {
					throw AppError.UNVERIFIED_EMAIL_AND_PHONE();
				}
			}
			break;
		case APP_ROLES.patient:
		case APP_ROLES.physician:
			{
				const userVerified =
					verifiedAtDateIsValid(user.emailVerifiedAt) ||
					verifiedAtDateIsValid(user.phoneNumberVerifiedAt);
				if (!userVerified) {
					throw AppError.UNVERIFIED_EMAIL_OR_PHONE();
				}
			}
			break;
	}
	return true;
}
function verifiedAtDateIsValid(date: Date | null) {
	if (!date) {
		return false;
	}
	return date <= new Date();
}
