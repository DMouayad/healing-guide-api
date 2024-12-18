import { getUserFromResponse } from "@/api/auth/utils";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { validateOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";
import { MailNotification } from "@/notifications/MailNotification";
import { SmsNotification } from "@/notifications/SmsNotification";
import { sendMailNotification, sendSmsNotification } from "@/notifications/mail.utils";
import type { Request, Response } from "express";
import { userRequests } from "../user.requests";
import { generateEmailVerificationTOTP, generatePhoneVerificationTOTP } from "./utils";

export async function verifyEmailAction(req: Request, res: Response) {
	const data = await userRequests.verifyEmail.parseAsync({
		body: req.body,
	});
	const providedCode = data.body.code;
	const user = getUserFromResponse(res);

	return checkUserEmailNotVerified(user)
		.then(getAppCtx().emailVerificationRepo.findBy)
		.then((otp) => validateOTP(providedCode, otp))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { emailVerifiedAt: new Date() }),
		)
		.then((_) => ApiResponse.success().send(res));
}

export async function sendEmailVerificationAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	return checkUserEmailNotVerified(user)
		.then(generateEmailVerificationTOTP)
		.then(getAppCtx().emailVerificationRepo.storeEmailVerification)
		.then(MailNotification.emailVerification)
		.then(sendMailNotification)
		.then((em) => ApiResponse.success().send(res));
}
export async function verifyPhoneAction(req: Request, res: Response) {
	const data = await userRequests.verifyPhone.parseAsync({
		body: req.body,
	});
	const providedCode = data.body.code;
	const user = getUserFromResponse(res);

	return checkUserPhoneNotVerified(user)
		.then(getAppCtx().phoneVerificationRepo.findBy)
		.then((phoneVerification) => validateOTP(providedCode, phoneVerification))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { phoneNumberVerifiedAt: new Date() }),
		)
		.then((_) => ApiResponse.success().send(res));
}

export async function sendPhoneVerificationAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	return checkUserPhoneNotVerified(user)
		.then(generatePhoneVerificationTOTP)
		.then(getAppCtx().phoneVerificationRepo.storePhoneVerification)
		.then(SmsNotification.phoneVerification)
		.then(sendSmsNotification)
		.then((em) => ApiResponse.success().send(res));
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
