import type { ObjectValues } from "src/common/types";
import type { IUser } from "src/interfaces/IUser";
import type { OTPWithCode } from "src/otp/otp.types";
import type { SignupCodedViaSMS } from "src/rest-api/auth/auth.types";

export const SMS_NOTIFICATIONS = {
	phoneVerification: "PHONE_VERIFICATION_NOTIFICATION",
	signupCode: "SIGNUP_CODE_NOTIFICATION",
	passwordReset: "PASSWORD_RESET",
} as const;
export type SmsNotificationType = ObjectValues<typeof SMS_NOTIFICATIONS>;

export abstract class SmsNotification {
	abstract receiverPhone(): string;
	constructor(readonly type: SmsNotificationType) {}
	static phoneVerification(user: IUser, otp: OTPWithCode) {
		return new OtpSmsNotification(user, otp, SMS_NOTIFICATIONS.phoneVerification);
	}
	static passwordReset(user: IUser, resetLink: string) {
		return new PasswordResetSmsNotification(user, resetLink);
	}
	static signupCode(code: SignupCodedViaSMS): SmsNotification {
		return new SignupCodeSmsNotification(code);
	}
}

export class OtpSmsNotification extends SmsNotification {
	override receiverPhone(): string {
		return this.user.phoneNumber;
	}
	constructor(
		readonly user: IUser,
		readonly otp: OTPWithCode,
		type: SmsNotificationType,
	) {
		super(type);
	}
}
export class SignupCodeSmsNotification extends SmsNotification {
	override receiverPhone(): string {
		return this.signupCode.phoneNumber;
	}
	constructor(readonly signupCode: SignupCodedViaSMS) {
		super(SMS_NOTIFICATIONS.signupCode);
	}
}
export class PasswordResetSmsNotification extends SmsNotification {
	override receiverPhone(): string {
		return this.user.phoneNumber;
	}
	constructor(
		readonly user: IUser,
		readonly resetLink: string,
	) {
		super(SMS_NOTIFICATIONS.passwordReset);
	}
}
