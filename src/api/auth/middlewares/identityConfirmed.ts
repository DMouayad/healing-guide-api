import AppError from "@/common/models/appError";
import { APP_ERR_CODES } from "@/common/models/errorCodes";
import { env } from "@/common/utils/envConfig";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { generateUserTOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";
import { MailNotification } from "@/notifications/MailNotification";
import { sendMailNotification } from "@/notifications/mail.utils";
import type { NextFunction, Request, Response } from "express";
import { getUserFromResponse } from "../utils";

export async function identityConfirmed(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	const user = getUserFromResponse(res);
	if (lastConfirmedAtIsValid(user.identityConfirmedAt)) {
		next();
	}
	const lastConfirmationCode = await getAppCtx().identityConfirmationRepo.findBy(user);

	const shouldSendNewCode = !lastConfirmationCode;

	if (shouldSendNewCode) {
		const newConfirmation = await createIdentityConfirmationCode(user);
		const notification = MailNotification.identityConfirmation(newConfirmation);
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
	const totp = generateUserTOTP(
		user,
		env.IDENTITY_CONFIRMATION_CODE_LENGTH,
		env.IDENTITY_CONFIRMATION_CODE_EXPIRATION,
	);
	return getAppCtx()
		.identityConfirmationRepo.deleteAllForUser(user)
		.then((_) => getAppCtx().identityConfirmationRepo.store(totp));
}
