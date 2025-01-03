import type { SignupCodeViaEmail } from "@/api/auth/auth.types";
import type { ObjectValues } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";
import type { OTPWithCode } from "@/otp/otp.types";

export const MAIL_NOTIFICATIONS = {
	emailVerification: "EMAIL_VERIFICATION_NOTIFICATION",
	identityConfirmation: "IDENTITY_CONFIRMATION_NOTIFICATION",
	signupCode: "SIGNUP_CODE_NOTIFICATION",
} as const;
export type MailNotificationType = ObjectValues<typeof MAIL_NOTIFICATIONS>;

export abstract class MailNotification {
	constructor(readonly type: MailNotificationType) {}
	abstract getReceiver(): string;

	static signupCode(signupCode: SignupCodeViaEmail, otpCode: string) {
		return new SignupCodeMailNotification(signupCode, otpCode);
	}
	static emailVerification(user: IUser, otp: OTPWithCode) {
		return new OTPMailNotification(user, otp, MAIL_NOTIFICATIONS.emailVerification);
	}
	static identityConfirmation(user: IUser, otp: OTPWithCode) {
		return new OTPMailNotification(user, otp, MAIL_NOTIFICATIONS.identityConfirmation);
	}
}

export class OTPMailNotification extends MailNotification {
	override getReceiver(): string {
		return this.user.email;
	}
	constructor(
		readonly user: IUser,
		readonly otp: OTPWithCode,
		type: MailNotificationType,
	) {
		super(type);
	}
}

export class SignupCodeMailNotification extends MailNotification {
	override getReceiver(): string {
		return this.signupCode.email;
	}
	constructor(
		readonly signupCode: SignupCodeViaEmail,
		readonly otpCode: string,
	) {
		super(MAIL_NOTIFICATIONS.signupCode);
	}
}
