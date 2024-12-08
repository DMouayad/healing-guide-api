import type { IUser } from "@/interfaces/IUser";
import type { MailNotification } from "@mail/MailNotification";
import type { SocketNotification } from "../common/types";
import { getAppCtx } from "../common/utils/getAppCtx";

export async function sendMailNotification(
	notification: MailNotification,
): Promise<void> {
	return getAppCtx().mailNotifier.sendNotification(notification);
}
export function notifyBySocketMsg(
	user: IUser,
	notification: SocketNotification,
): void {}
