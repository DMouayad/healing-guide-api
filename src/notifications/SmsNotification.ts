import type { ObjectValues, UserTOTP } from "@/common/types";
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
	static phoneVerification(userTOTP: UserTOTP) {
		return new TOTPSmsNotification(userTOTP, SMS_NOTIFICATIONS.phoneVerification);
	}
}
export class TOTPSmsNotification extends SmsNotification {
	constructor(
		readonly userTOTP: UserTOTP,
		type: SmsNotificationType,
	) {
		super(userTOTP.user, type);
	}
}
