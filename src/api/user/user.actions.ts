import { NOTIFICATIONS } from "@/common/constants";
import { ActionResult } from "@/common/models/actionResult";
import AppError from "@/common/models/appError";
import { myEventEmitter } from "@/common/models/myEventEmitter";
import { APP_ROLES } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { handleAction } from "@/common/utils/handleAction";
import { notifyByMail } from "@/common/utils/notifications";
import type { IUser } from "@/interfaces/IUser";
import { UserResource } from "@/resources/userResource";
import type { Request, Response } from "express";
import { UserVerifiedEvent } from "./user.events";
import { userRequests } from "./user.requests";

export async function deleteUserAction(req: Request, res: Response) {
	const currentUser: IUser | undefined = res.locals.auth?.user;
	if (!currentUser) {
		throw AppError.UNAUTHENTICATED();
	}
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.delete(currentUser),
		onResult: (_) => ActionResult.success(),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

async function getUser(req: Request, res: Response) {
	const data = await userRequests.get.parseAsync({ params: req.params });
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.find(data.params.id),
		onResult: (user) => ActionResult.success({ responseObject: UserResource.create(user) }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}
export async function getNonAdminUsersAction(req: Request, res: Response) {
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.getWithRoles([
			APP_ROLES.facilityManager,
			APP_ROLES.patient,
			APP_ROLES.physician,
		]),
		onResult: (users) =>
			ActionResult.success({ responseObject: users.map(UserResource.create) }),
	});
}

export function updateUserActivationStatus(isActivated: boolean) {
	return async (req: Request, res: Response) => {
		return userRequests.changeActivation
			.parseAsync({ params: req.params })
			.then(async (data) => {
				await handleAction({
					res,
					resultPromise: getAppCtx().userRepository.updateById(data.params.id, {
						activated: isActivated,
					}),
					onResult: (user) =>
						ActionResult.success({ responseObject: UserResource.create(user) }),
					onResultUndefinedThrow: () =>
						AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
				});
			});
	};
}
export async function updateUser(req: Request, res: Response) {
	const data = await userRequests.update.parseAsync({
		params: req.params,
		body: req.body,
	});
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.update(res.locals.auth.user, data.body),
		onResult: (user) => ActionResult.success({ responseObject: UserResource.create(user) }),
		onResultUndefinedThrow: () => AppError.ENTITY_NOT_FOUND({ message: "User not found!" }),
	});
}

export async function verifyEmailAction(req: Request, res: Response) {
	const user: IUser | undefined = res.locals.user;
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (user.emailVerifiedAt) {
		throw AppError.EMAIL_ALREADY_VERIFIED();
	}
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.update(user, {
			emailVerifiedAt: new Date(),
		}),
		onResult: (result) => {
			myEventEmitter.emit(UserVerifiedEvent.name, new UserVerifiedEvent(user));
			return ActionResult.success();
		},
	});
}

export async function resendEmailVerificationAction(req: Request, res: Response) {
	const user: IUser | undefined = res.locals.user;
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	await handleAction({
		res,
		resultPromise: notifyByMail(user, NOTIFICATIONS.emailVerification),
		onResult: (msgId) => ActionResult.success(),
	});
}
