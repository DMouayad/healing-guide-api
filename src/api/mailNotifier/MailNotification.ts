import type { EmailVerification } from "../emailVerification/EmailVerification";

export type NotificationId = string;
export class MailNotification {
	constructor(
		readonly subject: string,
		readonly from: string,
		readonly to: string,
		readonly text?: string,
		readonly html?: string,
	) {}
}

export function createEmailVerificationNotification(
	emailVerification: EmailVerification,
): MailNotification {}
