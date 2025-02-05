import type { Request, Response } from "express";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import { getAppCtx } from "src/common/utils/getAppCtx";
import type { IUser } from "src/interfaces/IUser";
import { MailNotification } from "src/notifications/MailNotification";
import { SmsNotification } from "src/notifications/SmsNotification";
import {
	sendMailNotification,
	sendSmsNotification,
} from "src/notifications/mail.utils";
import {
	generateEmailVerificationOTP,
	generatePhoneVerificationOTP,
	validateEmailVerificationCode,
} from "src/otp/otp.utils";
import { getUserFromResponse } from "src/rest-api/auth/utils";
import { userRequests } from "./user.requests";

export async function verifyEmailAction(req: Request, res: Response) {
	const data = await userRequests.verifyEmail.parseAsync(req.body);
	const providedCode = data.code;
	const user = getUserFromResponse(res);

	return checkUserEmailNotVerified(user)
		.then((user) => validateEmailVerificationCode(providedCode, user))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { emailVerifiedAt: new Date() }),
		)
		.then((_) => ApiResponse.success().send(res));
}

export async function sendEmailVerificationAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	return checkUserEmailNotVerified(user).then((user) => {
		const otp = generateEmailVerificationOTP(user);
		const notification = MailNotification.emailVerification(user, otp);
		return getAppCtx()
			.otpRepository.store(otp)
			.then((_) => sendMailNotification(notification))
			.then((em) => ApiResponse.success().send(res));
	});
}
export async function verifyPhoneAction(req: Request, res: Response) {
	const data = await userRequests.verifyPhone.parseAsync(req.body);
	const providedCode = data.code;
	const user = getUserFromResponse(res);
	//TODO: since we don't have a working way to send a code through sms yet, we'll
	// verify the user phone number with any provided code.
	return (
		checkUserPhoneNotVerified(user)
			// .then((user) => validatePhoneVerificationCode(providedCode, user))
			.then((_) =>
				getAppCtx().userRepository.update(user!, { phoneNumberVerifiedAt: new Date() }),
			)
			.then((_) => ApiResponse.success().send(res))
	);
}

export async function sendPhoneVerificationAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);
	return checkUserPhoneNotVerified(user).then((user) => {
		const otp = generatePhoneVerificationOTP(user);
		const notification = SmsNotification.phoneVerification(user, otp);
		return getAppCtx()
			.otpRepository.store(otp)
			.then((_) => sendSmsNotification(notification))
			.then((em) => ApiResponse.success().send(res));
	});
}

function checkUserEmailNotVerified(user: IUser | undefined) {
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (user.emailVerifiedAt) {
		throw AppError.EMAIL_ALREADY_VERIFIED();
	}
	return Promise.resolve(user);
}
function checkUserPhoneNotVerified(user: IUser | undefined) {
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (user.phoneNumberVerifiedAt) {
		throw AppError.PHONE_ALREADY_VERIFIED();
	}
	return Promise.resolve(user);
}
