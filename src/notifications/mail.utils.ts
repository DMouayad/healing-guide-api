import type { MailNotification } from "@/notifications/MailNotification";
import type { IUser } from "@interfaces/IUser";
import type { SocketNotification } from "../common/types";
import { getAppCtx } from "../common/utils/getAppCtx";
import type { SmsNotification } from "./SmsNotification";

export async function sendMailNotification(
	notification: MailNotification,
): Promise<void> {
	return getAppCtx().mailNotifier.sendNotification(notification);
}
export async function sendSmsNotification(
	notification: SmsNotification,
): Promise<void> {
	return getAppCtx().smsNotifier.sendNotification(notification);
}
export function notifyBySocketMsg(
	user: IUser,
	notification: SocketNotification,
): void {}
