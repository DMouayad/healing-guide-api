import { OTP_SENDING_METHODS, type OtpSendingMethod } from "@/api/auth/auth.types";
import ApiResponse from "@/common/models/apiResponse";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { bcryptHash } from "@/common/utils/hashing";
import type { IUser } from "@/interfaces/IUser";
import { MailNotification } from "@/notifications/MailNotification";
import { SmsNotification } from "@/notifications/SmsNotification";
import { sendMailNotification, sendSmsNotification } from "@/notifications/mail.utils";
import type { Request, Response } from "express";
import { passwordResetRoutes } from "./passwordReset.router";
import { forgotPasswordRequest, resetPasswordRequest } from "./passwordReset.types";
import {
	generatePasswordResetLink,
	generatePasswordResetToken,
	validatePasswordResetToken,
} from "./passwordReset.utils";

export async function forgotPasswordAction(req: Request, res: Response) {
	const bodyValidation = forgotPasswordRequest.body.safeParse(req.body);
	if (bodyValidation.error) {
		req.flash(
			"errors",
			bodyValidation.error.errors.map((error) => error.message),
		);
		req.flash("input", req.body);
		const receiveVia = req.body.receiveVia ?? "email";
		const redirectTo = `/forgot-password${receiveVia === "email" ? "/email" : "/phone"}`;
		return res.redirect(redirectTo);
	}
	const data = bodyValidation.data;
	const emailOrPhone =
		data.receiveVia === OTP_SENDING_METHODS.mail ? data.email : data.phone;

	const user = await getAppCtx().userRepository.findByEmailOrPhoneNumber(emailOrPhone);
	if (user) {
		const pr = generatePasswordResetToken(emailOrPhone);
		await getAppCtx().passwordResetRepository.store(pr);
		const resetLink = generatePasswordResetLink(pr.token);
		await sendPasswordResetLink(data.receiveVia, user, resetLink);
	}
	if (req.accepts("html")) {
		req.flash("forgotPassword.identifier", emailOrPhone);
		res.redirect(passwordResetRoutes.forgotPasswordEnd);
	} else {
		ApiResponse.success().send(res);
	}
}

async function sendPasswordResetLink(
	receiveVia: OtpSendingMethod,
	user: IUser,
	resetLink: string,
) {
	if (receiveVia === OTP_SENDING_METHODS.mail) {
		const notification = MailNotification.passwordReset(user, resetLink);
		sendMailNotification(notification);
	} else {
		const notification = SmsNotification.passwordReset(user, resetLink);
		sendSmsNotification(notification);
	}
}

export async function resetPasswordAction(req: Request, res: Response) {
	const { token } = resetPasswordRequest.params.parse(req.params);
	const { password } = resetPasswordRequest.body.parse(req.body);

	const passwordReset = await validatePasswordResetToken(token);

	const newPassword = await bcryptHash(password);
	await getAppCtx().userRepository.updateUserPassword(
		passwordReset.issuedFor,
		newPassword,
	);

	if (req.accepts("html")) {
		return res.redirect(passwordResetRoutes.passwordResetSuccess);
	}
	return ApiResponse.success().send(res);
}
