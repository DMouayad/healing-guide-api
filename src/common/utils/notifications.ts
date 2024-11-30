import type {
	MailNotification,
	NotificationId,
} from "@/api/mailNotifier/MailNotification";
import type { IUser } from "@/interfaces/IUser";
import type { SocketNotification } from "../types";
import { getAppCtx } from "./getAppCtx";

export async function sendByMail(
	notification: MailNotification,
): Promise<NotificationId> {
	return getAppCtx().mailNotifier.sendNotification(notification);
}
export function notifyBySocketMsg(
	user: IUser,
	notification: SocketNotification,
): void {}
