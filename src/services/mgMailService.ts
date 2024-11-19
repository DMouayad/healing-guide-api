import type { MailRecipient, NotificationId, NotificationType } from "@/common/types";
import type { IMailService } from "@/interfaces/IMailService";

export class MGMailService implements IMailService {
	send(
		recipient: MailRecipient,
		notification: NotificationType,
	): Promise<NotificationId> {
		throw new Error("Method not implemented.");
	}
}
