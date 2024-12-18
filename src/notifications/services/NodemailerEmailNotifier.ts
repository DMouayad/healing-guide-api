import { env } from "@/common/utils/envConfig";
import nodemailer from "nodemailer";
import type { IMailNotifier } from "./IMailNotifier";

import { IMAGES } from "@/common/constants";
import {
	EmailVerificationNotification,
	IdentityConfirmationNotification,
	type MailNotification,
} from "@/notifications/MailNotification";
import { emailVerificationMailTemplate } from "@/notifications/mailTemplates/emailVerificationTemplate";
import type Mail from "nodemailer/lib/mailer";
import { identityConfirmationMailTemplate } from "../mailTemplates/identityConfirmationTemplate";

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
			case notification instanceof IdentityConfirmationNotification:
				return {
					...basePayload,
					subject: "Confirm your identity",
					html: identityConfirmationMailTemplate(notification),
				};
			case notification instanceof EmailVerificationNotification:
				return {
					...basePayload,
					subject: "Verify your Email",
					text: "",
					html: emailVerificationMailTemplate(notification.emailVerification),
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
		? notification.user.email
		: "muayad.perun@outlook.com";
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
