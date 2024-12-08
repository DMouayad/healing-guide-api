import { env } from "@/common/utils/envConfig";
import nodemailer from "nodemailer";
import type { IMailNotifier } from "./IMailNotifier";

import { IMAGES } from "@/common/constants";
import {
	EmailVerificationNotification,
	type MailNotification,
} from "@mail/MailNotification";
import {
	LOGO_IMG_CID,
	emailVerificationTemplate,
} from "@mail/mailTemplates/emailVerificationTemplate";
import type Mail from "nodemailer/lib/mailer";

export class NodemailerEmailNotifier implements IMailNotifier {
	async sendNotification(notification: MailNotification): Promise<void> {
		const client = getClient();
		const payload = this.getMailPayload(notification);
		await client.sendMail(payload);
	}
	getMailPayload(notification: MailNotification): Mail.Options {
		switch (true) {
			case notification instanceof EmailVerificationNotification:
				return {
					to:
						env.NODE_ENV === "production"
							? notification.emailVerification.user.email
							: "muayad.perun@outlook.com",
					from: `Healing Guide <${env.ZOHO_EMAIL}>`,
					subject: "Verify your Email",
					text: "",
					html: emailVerificationTemplate(notification.emailVerification),
					attachments: [
						{
							filename: IMAGES.logo.name,
							path: IMAGES.logo.path,
							cid: LOGO_IMG_CID,
						},
					],
				};
			default:
				return {};
		}
	}
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
