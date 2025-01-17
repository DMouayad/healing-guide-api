import { env } from "@common/utils/envConfig";
import nodemailer from "nodemailer";
import type { IMailNotifier } from "./IMailNotifier";

import {
	MAIL_NOTIFICATIONS,
	type MailNotification,
	OTPMailNotification,
	PasswordResetMailNotification,
	SignupCodeMailNotification,
} from "@/notifications/MailNotification";
import { emailVerificationMailTemplate } from "@/transactionalEmailTemplates/emailVerificationTemplate";
import { identityConfirmationMailTemplate } from "@/transactionalEmailTemplates/identityConfirmationTemplate";
import { passwordResetMailTemplate } from "@/transactionalEmailTemplates/passwordResetTemplate";
import { signupCodeMailTemplate } from "@/transactionalEmailTemplates/signupCodeTemplate";
import { IMAGES } from "@common/constants";
import AppError from "@common/models/appError";
import type Mail from "nodemailer/lib/mailer";

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
		: "mouayad.alhamwi.ma@gmail.com";
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
