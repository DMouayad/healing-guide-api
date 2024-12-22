import type { SignupCode } from "@/api/auth/auth.types";
import type { ObjectValues, UserTOTP } from "@/common/types";

export const MAIL_NOTIFICATIONS = {
	emailVerification: "EMAIL_VERIFICATION_NOTIFICATION",
	identityConfirmation: "IDENTITY_CONFIRMATION_NOTIFICATION",
	signupCode: "SIGNUP_CODE_NOTIFICATION",
} as const;
export type MailNotificationType = ObjectValues<typeof MAIL_NOTIFICATIONS>;

export abstract class MailNotification {
	constructor(readonly type: MailNotificationType) {}
	abstract getReceiver(): string;

	static signupCode(code: SignupCode) {
		return new SignupCodeMailNotification(code);
	}
	static emailVerification(userTOTP: UserTOTP) {
		return new TOTPMailNotification(userTOTP, MAIL_NOTIFICATIONS.emailVerification);
	}
	static identityConfirmation(userTOTP: UserTOTP) {
		return new TOTPMailNotification(userTOTP, MAIL_NOTIFICATIONS.identityConfirmation);
	}
}

export class TOTPMailNotification extends MailNotification {
	override getReceiver(): string {
		return this.userTOTP.user.email;
	}
	constructor(
		readonly userTOTP: UserTOTP,
		type: MailNotificationType,
	) {
		super(type);
	}
}

export class SignupCodeMailNotification extends MailNotification {
	override getReceiver(): string {
		return this.signupCode.email!;
	}
	constructor(readonly signupCode: SignupCode) {
		super(MAIL_NOTIFICATIONS.signupCode);
	}
}
