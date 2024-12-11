import { getUserFromResponse } from "@/api/auth/utils";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import type { IUser } from "@/interfaces/IUser";
import { EmailVerificationNotification } from "@/notifications/MailNotification";
import { PhoneVerificationNotification } from "@/notifications/SmsNotification";
import { sendMailNotification, sendSmsNotification } from "@/notifications/mail.utils";
import type { Request, Response } from "express";
import { userRequests } from "../user.requests";
import {
	generateEmailVerification,
	generatePhoneVerification,
	validateVerificationCode,
} from "./utils";

export async function verifyEmailAction(req: Request, res: Response) {
	const data = await userRequests.verifyEmail.parseAsync({
		body: req.body,
	});
	const providedCode = data.body.code;
	const user = getUserFromResponse(res);

	return checkUserEmailNotVerified(user)
		.then(getAppCtx().emailVerificationRepo.findBy)
		.then((userEV) => validateVerificationCode(providedCode, userEV))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { emailVerifiedAt: new Date() }),
		)
		.then((_) => ApiResponse.success().send(res));
}

export async function sendEmailVerificationAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	return checkUserEmailNotVerified(user)
		.then(generateEmailVerification)
		.then(getAppCtx().emailVerificationRepo.storeEmailVerification)
		.then(EmailVerificationNotification.fromEmailVerification)
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
		.then((userEV) => validateVerificationCode(providedCode, userEV))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { phoneNumberVerifiedAt: new Date() }),
		)
		.then((_) => ApiResponse.success().send(res));
}

export async function sendPhoneVerificationAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	return checkUserPhoneNotVerified(user)
		.then(generatePhoneVerification)
		.then(getAppCtx().phoneVerificationRepo.storePhoneVerification)
		.then(PhoneVerificationNotification.fromPhoneVerification)
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
