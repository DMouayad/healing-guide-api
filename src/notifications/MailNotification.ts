import type { ObjectValues, UserTOTP } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export const MAIL_NOTIFICATIONS = {
	emailVerification: "EMAIL_VERIFICATION_NOTIFICATION",
	identityConfirmation: "IDENTITY_CONFIRMATION_NOTIFICATION",
} as const;
export type MailNotificationType = ObjectValues<typeof MAIL_NOTIFICATIONS>;

export abstract class MailNotification {
	constructor(
		readonly user: IUser,
		readonly type: MailNotificationType,
	) {}
	static emailVerification(userTOTP: UserTOTP) {
		return new TOTPMailNotification(userTOTP, MAIL_NOTIFICATIONS.emailVerification);
	}
	static identityConfirmation(userTOTP: UserTOTP) {
		return new TOTPMailNotification(userTOTP, MAIL_NOTIFICATIONS.identityConfirmation);
	}
}
export class TOTPMailNotification extends MailNotification {
	constructor(
		readonly userTOTP: UserTOTP,
		type: MailNotificationType,
	) {
		super(userTOTP.user, type);
	}
}
