import type { EmailVerification } from "@/api/user/emailVerification/EmailVerification";
import type { ObjectValues } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export const MAIL_NOTIFICATIONS = {
	EmailVerification: "EMAIL_VERIFICATION_NOTIFICATION",
} as const;
export type MailNotificationType = ObjectValues<typeof MAIL_NOTIFICATIONS>;

export abstract class MailNotification {
	constructor(
		readonly user: IUser,
		readonly type: MailNotificationType,
	) {}
}
export class EmailVerificationNotification extends MailNotification {
	constructor(readonly emailVerification: EmailVerification) {
		super(emailVerification.user, MAIL_NOTIFICATIONS.EmailVerification);
	}
	static fromEmailVerification(emailVerification: EmailVerification) {
		return new EmailVerificationNotification(emailVerification);
	}
}
