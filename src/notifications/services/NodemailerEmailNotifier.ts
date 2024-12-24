import { env } from "@/common/utils/envConfig";
import nodemailer from "nodemailer";
import type { IMailNotifier } from "./IMailNotifier";

import { IMAGES } from "@/common/constants";
import {
	MAIL_NOTIFICATIONS,
	type MailNotification,
	SignupCodeMailNotification,
	TOTPMailNotification,
} from "@/notifications/MailNotification";
import { emailVerificationMailTemplate } from "@/notifications/mailTemplates/emailVerificationTemplate";
import type Mail from "nodemailer/lib/mailer";
import { identityConfirmationMailTemplate } from "../mailTemplates/identityConfirmationTemplate";
import { signupCodeMailTemplate } from "../mailTemplates/signupCodeTemplate";

export const LOGO_IMG_CID = "template_logo_img";

export class NodemailerEmailNotifier implements IMailNotifier {
	async sendNotification(notification: MailNotification): Promise<void> {
		const client = getClient();
		const payload = this.getMailPayload(notification);
		await client.sendMail(payload);
	}
	getMailPayload(notification: MailNotification): Mail.Options {
		const basePayload = {
			to: getReceivers(notification),
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
			case notification instanceof TOTPMailNotification &&
				notification.type === MAIL_NOTIFICATIONS.identityConfirmation:
				return {
					...basePayload,
					subject: "Confirm your identity",
					html: identityConfirmationMailTemplate(notification.userTOTP),
				};
			case notification instanceof TOTPMailNotification &&
				notification.type === MAIL_NOTIFICATIONS.emailVerification:
				return {
					...basePayload,
					subject: "Verify your Email",
					text: "",
					html: emailVerificationMailTemplate(notification.userTOTP),
				};
			case notification instanceof SignupCodeMailNotification:
				return {
					...basePayload,
					subject: "Complete signing up",
					text: "",
					html: signupCodeMailTemplate(notification.signupCode),
				};
			default:
				return {};
		}
	}
}
function getSender() {
	return `Healing Guide <${env.ZOHO_EMAIL}>`;
}
function getReceivers(notification: MailNotification) {
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
