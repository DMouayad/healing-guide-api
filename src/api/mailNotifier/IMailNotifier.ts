import type { MailNotification, NotificationId } from "./MailNotification";

export interface IMailNotifier {
	sendNotification(notification: MailNotification): Promise<NotificationId>;
}
