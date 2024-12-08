import type { MailNotification } from "../MailNotification";

export interface IMailNotifier {
	sendNotification(notification: MailNotification): Promise<void>;
}
