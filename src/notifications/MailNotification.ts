import type { VerificationCode } from "@/api/user/verification/types";
import type { ObjectValues } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export const MAIL_NOTIFICATIONS = {
	emailVerification: "EMAIL_VERIFICATION_NOTIFICATION",
} as const;
export type MailNotificationType = ObjectValues<typeof MAIL_NOTIFICATIONS>;

export abstract class MailNotification {
	constructor(
		readonly user: IUser,
		readonly type: MailNotificationType,
	) {}
}
export class EmailVerificationNotification extends MailNotification {
	constructor(readonly emailVerification: VerificationCode) {
		super(emailVerification.user, MAIL_NOTIFICATIONS.emailVerification);
	}
	static fromEmailVerification(emailVerification: VerificationCode) {
		return new EmailVerificationNotification(emailVerification);
	}
}
