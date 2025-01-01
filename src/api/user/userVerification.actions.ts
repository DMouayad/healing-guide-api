import { getUserFromResponse } from "@/api/auth/utils";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import type { IUser } from "@/interfaces/IUser";
import { MailNotification } from "@/notifications/MailNotification";
import { SmsNotification } from "@/notifications/SmsNotification";
import { sendMailNotification, sendSmsNotification } from "@/notifications/mail.utils";
import {
	generateEmailVerificationOTP,
	generatePhoneVerificationOTP,
	validateEmailVerificationCode,
} from "@/otp/otp.utils";
import type { Request, Response } from "express";
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
