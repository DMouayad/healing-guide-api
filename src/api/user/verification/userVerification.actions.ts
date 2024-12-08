import { userFromResponse } from "@/api/auth/utils";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import type { IUser } from "@/interfaces/IUser";
import { EmailVerificationNotification } from "@/mail/MailNotification";
import { sendMailNotification } from "@/mail/mail.utils";
import type { Request, Response } from "express";
import { userRequests } from "../user.requests";
import { generateEmailVerification, validateEmailVerificationCode } from "./utils";

export async function verifyEmailAction(req: Request, res: Response) {
	const data = await userRequests.verifyEmail.parseAsync({
		body: req.body,
	});
	const providedCode = data.body.code;
	const user = userFromResponse(res);

	return checkUserNotVerified(user)
		.then(getAppCtx().emailVerificationRepo.findBy)
		.then((userEV) => validateEmailVerificationCode(providedCode, userEV))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { emailVerifiedAt: new Date() }),
		)
		.then((_) => ApiResponse.success().send(res));
}

export async function sendEmailVerificationAction(req: Request, res: Response) {
	const user = userFromResponse(res);

	return checkUserNotVerified(user)
		.then(generateEmailVerification)
		.then(getAppCtx().emailVerificationRepo.storeEmailVerification)
		.then(EmailVerificationNotification.fromEmailVerification)
		.then(sendMailNotification)
		.then((em) => ApiResponse.success().send(res));
}

function checkUserNotVerified(user: IUser | undefined) {
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (user.emailVerifiedAt) {
		throw AppError.EMAIL_ALREADY_VERIFIED();
	}
	return Promise.resolve(user);
}
