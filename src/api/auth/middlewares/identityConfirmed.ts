import AppError from "@/common/models/appError";
import { APP_ERR_CODES } from "@/common/models/errorCodes";
import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { generateOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";
import { IdentityConfirmationNotification } from "@/notifications/MailNotification";
import { sendMailNotification } from "@/notifications/mail.utils";
import type { NextFunction, Request, Response } from "express";
import { getUserFromResponse } from "../utils";

export async function identityConfirmed(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	const user = getUserFromResponse(res);
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (lastConfirmedAtIsValid(user.identityConfirmedAt)) {
		next();
	}
	const lastConfirmationCode = await getAppCtx().identityConfirmationRepo.findBy(user);

	const shouldSendNewCode = !lastConfirmationCode;

	if (shouldSendNewCode) {
		const newConfirmation = await createIdentityConfirmationCode(user);
		const notification = new IdentityConfirmationNotification(newConfirmation);
		sendMailNotification(notification);
	}
	throw AppError.FORBIDDEN({ errCode: APP_ERR_CODES.CONFIRM_IDENTITY });
}
function lastConfirmedAtIsValid(confirmationDate: Date | null): boolean {
	if (!confirmationDate) {
		return false;
	}
	const twInMilliseconds = env.IDENTITY_CONFIRMATION_TIME_WINDOW * 60 * 1000;
	const confirmedAtPlusTimeWindow = confirmationDate.getTime() + twInMilliseconds;
	return Date.now() < confirmedAtPlusTimeWindow;
}
async function createIdentityConfirmationCode(user: IUser) {
	const code = generateOTP(env.IDENTITY_CONFIRMATION_CODE_LENGTH);
	return getAppCtx()
		.identityConfirmationRepo.deleteAllForUser(user)
		.then((_) =>
			getAppCtx().identityConfirmationRepo.store({
				user,
				code,
				expiresAt: getExpiresAt(env.IDENTITY_CONFIRMATION_CODE_EXPIRATION),
			}),
		);
}
