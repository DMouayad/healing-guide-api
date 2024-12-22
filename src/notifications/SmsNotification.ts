import type { SignupCode } from "@/api/auth/auth.types";
import type { ObjectValues, UserTOTP } from "@/common/types";

export const SMS_NOTIFICATIONS = {
	phoneVerification: "PHONE_VERIFICATION_NOTIFICATION",
	signupCode: "SIGNUP_CODE_NOTIFICATION",
} as const;
export type SmsNotificationType = ObjectValues<typeof SMS_NOTIFICATIONS>;

export abstract class SmsNotification {
	abstract receiverPhone(): string;
	constructor(readonly type: SmsNotificationType) {}
	static phoneVerification(userTOTP: UserTOTP) {
		return new TOTPSmsNotification(userTOTP, SMS_NOTIFICATIONS.phoneVerification);
	}
	static signupCode(code: SignupCode): SmsNotification {
		throw new Error("Method not implemented.");
	}
}

export class TOTPSmsNotification extends SmsNotification {
	override receiverPhone(): string {
		return this.userTOTP.user.phoneNumber;
	}
	constructor(
		readonly userTOTP: UserTOTP,
		type: SmsNotificationType,
	) {
		super(type);
	}
}
export class SignupCodeSmsNotification extends SmsNotification {
	override receiverPhone(): string {
		return this.signupCode.phoneNumber;
	}
	constructor(readonly signupCode: SignupCode) {
		super(SMS_NOTIFICATIONS.signupCode);
	}
}
