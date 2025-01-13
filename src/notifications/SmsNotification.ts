import type { SignupCodedViaSMS } from "@api/auth/auth.types";
import type { ObjectValues } from "@common/types";
import type { IUser } from "@interfaces/IUser";
import type { OTPWithCode } from "@otp/otp.types";

export const SMS_NOTIFICATIONS = {
	phoneVerification: "PHONE_VERIFICATION_NOTIFICATION",
	signupCode: "SIGNUP_CODE_NOTIFICATION",
} as const;
export type SmsNotificationType = ObjectValues<typeof SMS_NOTIFICATIONS>;

export abstract class SmsNotification {
	abstract receiverPhone(): string;
	constructor(readonly type: SmsNotificationType) {}
	static phoneVerification(user: IUser, otp: OTPWithCode) {
		return new OtpSmsNotification(user, otp, SMS_NOTIFICATIONS.phoneVerification);
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
