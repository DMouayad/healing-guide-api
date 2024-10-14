import type { MailRecipient, NotificationId, NotificationType } from "@/common/types";
export interface IMailService {
	send(recipient: MailRecipient, notification: NotificationType): Promise<NotificationId>;
}
