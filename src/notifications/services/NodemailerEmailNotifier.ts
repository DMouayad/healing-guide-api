import nodemailer from "nodemailer";
import { env } from "src/common/utils/envConfig";
import type { IMailNotifier } from "./IMailNotifier";

import type Mail from "nodemailer/lib/mailer";
import { IMAGES } from "src/common/constants";
import AppError from "src/common/models/appError";
import {
	MAIL_NOTIFICATIONS,
	type MailNotification,
	OTPMailNotification,
	PasswordResetMailNotification,
	SignupCodeMailNotification,
} from "src/notifications/MailNotification";
import { emailVerificationMailTemplate } from "src/transactionalEmailTemplates/emailVerificationTemplate";
import { identityConfirmationMailTemplate } from "src/transactionalEmailTemplates/identityConfirmationTemplate";
import { passwordResetMailTemplate } from "src/transactionalEmailTemplates/passwordResetTemplate";
import { signupCodeMailTemplate } from "src/transactionalEmailTemplates/signupCodeTemplate";

export const LOGO_IMG_CID = "template_logo_img";

export class NodemailerEmailNotifier implements IMailNotifier {
	async sendNotification(notification: MailNotification): Promise<void> {
		const client = getClient();
		const payload = this.getMailPayload(notification);
		await client.sendMail(payload);
	}
	getMailPayload(notification: MailNotification): Mail.Options {
		const receiver = getReceiver(notification);
		if (!receiver) {
			throw AppError.SERVER_ERROR({ message: "Invalid email receiver" });
		}
		const basePayload = {
			to: receiver,
			from: getSender(),
			attachments: [
				{
					filename: IMAGES.logo.name,
					path: IMAGES.logo.path,
					cid: LOGO_IMG_CID,
				},
			],
		};
		switch (true) {
			case notification instanceof OTPMailNotification &&
				notification.type === MAIL_NOTIFICATIONS.identityConfirmation:
				return {
					...basePayload,
					subject: "Confirm your identity",
					html: identityConfirmationMailTemplate(notification),
				};
			case notification instanceof OTPMailNotification &&
				notification.type === MAIL_NOTIFICATIONS.emailVerification:
				return {
					...basePayload,
					subject: "Verify your Email",
					text: "",
					html: emailVerificationMailTemplate(notification),
				};
			case notification instanceof SignupCodeMailNotification:
				return {
					...basePayload,
					subject: "Complete signing up",
					text: "",
					html: signupCodeMailTemplate(notification),
				};
			case notification instanceof PasswordResetMailNotification:
				return {
					...basePayload,
					subject: "Reset your password",
					text: "",
					html: passwordResetMailTemplate(notification),
				};
			default:
				return {};
		}
	}
}
function getSender() {
	return `Healing Guide <${env.ZOHO_EMAIL}>`;
}
function getReceiver(notification: MailNotification) {
	return env.NODE_ENV === "production"
		? notification.getReceiver()
		: "mouayad.alhamwi.masrc/gmail.com";
}
function getClient() {
	return nodemailer.createTransport({
		host: "smtp.zoho.eu",
		port: 465,
		secure: true,
		auth: {
			user: env.ZOHO_EMAIL,
			pass: env.ZOHO_PASSWORD,
		},
	});
}
