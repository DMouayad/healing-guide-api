import type { VerificationCode } from "@/api/user/verification/types";
import type { ObjectValues } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export const SMS_NOTIFICATIONS = {
	phoneVerification: "PHONE_VERIFICATION_NOTIFICATION",
} as const;
export type SmsNotificationType = ObjectValues<typeof SMS_NOTIFICATIONS>;

export abstract class SmsNotification {
	constructor(
		readonly user: IUser,
		readonly type: SmsNotificationType,
	) {}
}
export class PhoneVerificationNotification extends SmsNotification {
	constructor(readonly phoneVerification: VerificationCode) {
		super(phoneVerification.user, SMS_NOTIFICATIONS.phoneVerification);
	}
	static fromPhoneVerification(phoneVerification: VerificationCode) {
		return new PhoneVerificationNotification(phoneVerification);
	}
}
