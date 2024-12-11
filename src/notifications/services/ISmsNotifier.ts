import type { SmsNotification } from "../SmsNotification";

export interface ISmsNotifier {
	sendNotification(notification: SmsNotification): Promise<void>;
}
