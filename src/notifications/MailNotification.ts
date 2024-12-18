import type { IdentityConfirmationCode } from "@/api/auth/auth.types";
import type { VerificationCode } from "@/api/user/verification/types";
import type { ObjectValues } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export const MAIL_NOTIFICATIONS = {
	emailVerification: "EMAIL_VERIFICATION_NOTIFICATION",
} as const;
export type MailNotificationType = ObjectValues<typeof MAIL_NOTIFICATIONS>;

export abstract class MailNotification {
	constructor(readonly user: IUser) {}
}
export class EmailVerificationNotification extends MailNotification {
	constructor(readonly emailVerification: VerificationCode) {
		super(emailVerification.user);
	}
	static fromEmailVerification(emailVerification: VerificationCode) {
		return new EmailVerificationNotification(emailVerification);
	}
}

export class IdentityConfirmationNotification extends MailNotification {
	constructor(readonly identityConfirmation: IdentityConfirmationCode) {
		super(identityConfirmation.user);
	}
}
