import { logger } from "@common/utils/logger";
import type { SmsNotification } from "../SmsNotification";
import type { ISmsNotifier } from "./ISmsNotifier";

export class FakeSmsNotifier implements ISmsNotifier {
	async sendNotification(notification: SmsNotification): Promise<void> {
		logger.info(this, `sent a message to ${notification.receiverPhone()}`);
	}
}
