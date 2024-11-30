import type { IMailNotifier } from "./IMailNotifier";
import type { MailNotification, NotificationId } from "./MailNotification";

export class MailGunEmailNotifier implements IMailNotifier {
	sendNotification(notification: MailNotification): Promise<NotificationId> {
		throw new Error("Method not implemented.");
	}
}
