import { MailNotification } from "@/notifications/MailNotification";
import { sendMailNotification } from "@/notifications/mail.utils";
import AppError from "@common/models/appError";
import { APP_ERR_CODES } from "@common/models/errorCodes";
import { env } from "@common/utils/envConfig";
import { getAppCtx } from "@common/utils/getAppCtx";
import type { IUser } from "@interfaces/IUser";
import { OTP_PURPOSES } from "@otp/otp.types";
import { generateIdentityConfirmationOTP } from "@otp/otp.utils";
import type { NextFunction, Request, Response } from "express";
import { getUserFromResponse } from "../utils";

export async function identityConfirmed(
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	const user = getUserFromResponse(res);
	if (confirmationDateIsValid(user.identityConfirmedAt)) {
		next();
	}
	const lastConfirmationCode = await getAppCtx().otpRepository.findIdentityConfirmation(
		user,
		{ unexpiredOnly: true },
	);

	if (!lastConfirmationCode) {
		const otp = await createIdentityConfirmationCode(user);
		const notification = MailNotification.identityConfirmation(user, otp);
		sendMailNotification(notification);
	}
	throw AppError.FORBIDDEN({ errCode: APP_ERR_CODES.CONFIRM_IDENTITY });
}
function confirmationDateIsValid(confirmationDate: Date | null): boolean {
	if (!confirmationDate) {
		return false;
	}
	const twInMilliseconds = env.IDENTITY_CONFIRMATION_TIME_WINDOW * 60 * 1000;
	const confirmedAtPlusTimeWindow = confirmationDate.getTime() + twInMilliseconds;
	return Date.now() < confirmedAtPlusTimeWindow;
}
async function createIdentityConfirmationCode(user: IUser) {
	const otp = generateIdentityConfirmationOTP(user);
	await getAppCtx().otpRepository.delete(
		user.id.toString(),
		OTP_PURPOSES.identityConfirmation,
	);
	await getAppCtx().otpRepository.store(otp);
	return otp;
}
