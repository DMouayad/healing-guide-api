import type { IUser } from "@/interfaces/IUser";
import type { NotificationId, NotificationType, SocketNotification } from "../types";
import { getAppCtx } from "./getAppCtx";

export async function notifyByMail(
	user: IUser,
	notifyFor: NotificationType,
): Promise<NotificationId> {
	return getAppCtx().mailService.send({ to: user.email }, notifyFor);
}
export function notifyBySocketMsg(user: IUser, notification: SocketNotification): void {}
