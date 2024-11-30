import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { myEventEmitter } from "@/common/models/myEventEmitter";
import { APP_ROLES } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { sendByMail } from "@/common/utils/notifications";
import type { IUser } from "@/interfaces/IUser";
import { UserResource } from "@/resources/userResource";
import type { Request, Response } from "express";
import { createEmailVerificationNotification } from "../mailNotifier/MailNotification";
import { UserVerifiedEvent } from "./user.events";
import { userRequests } from "./user.requests";

export async function deleteUserAction(req: Request, res: Response) {
	const currentUser: IUser | undefined = res.locals.auth?.user;
	if (!currentUser) {
		throw AppError.UNAUTHENTICATED();
	}
	return getAppCtx()
		.userRepository.delete(currentUser)
		.then(checkUser)
		.then((_) => ApiResponse.success().send(res));
}

async function getUser(req: Request, res: Response) {
	const data = await userRequests.get.parseAsync({ params: req.params });
	return getAppCtx()
		.userRepository.find(data.params.id)
		.then(checkUser)
		.then((user) => ApiResponse.success({ data: UserResource.create(user) }).send(res));
}
export function getNonAdminUsersAction(req: Request, res: Response) {
	return getAppCtx()
		.userRepository.getWithRoles([
			APP_ROLES.facilityManager,
			APP_ROLES.patient,
			APP_ROLES.physician,
		])
		.then((users) => ApiResponse.success({ data: users.map(UserResource.create) }))
		.then((apiResponse) => apiResponse.send(res));
}

export async function updateUserActivationStatus(req: Request, res: Response) {
	const data = await userRequests.updateActivation.parseAsync({ params: req.params });
	return getAppCtx()
		.userRepository.updateById(data.params.id, data.body)
		.then(checkUser)
		.then((user) => {
			return user.activated
				? ApiResponse.success()
				: ApiResponse.error(AppError.SERVER_ERROR());
		})
		.then((apiResponse) => apiResponse.send(res));
}
export async function updateUser(req: Request, res: Response) {
	const data = await userRequests.update.parseAsync({
		params: req.params,
		body: req.body,
	});
	return getAppCtx()
		.userRepository.update(res.locals.auth.user, data.body)
		.then(checkUser)
		.then((user) => ApiResponse.success({ data: UserResource.create(user) }))
		.then((apiResponse) => apiResponse.send(res));
}

export async function verifyEmailAction(req: Request, res: Response) {
	const user: IUser | undefined = res.locals.user;
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	if (user.emailVerifiedAt) {
		throw AppError.EMAIL_ALREADY_VERIFIED();
	}
	return getAppCtx()
		.userRepository.update(user, { emailVerifiedAt: new Date() })
		.then((result) => {
			myEventEmitter.emit(UserVerifiedEvent.name, new UserVerifiedEvent(user));
		})
		.then((_) => ApiResponse.success().send(res));
}

export async function resendEmailVerificationAction(req: Request, res: Response) {
	const user: IUser | undefined = res.locals.user;
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	const notification = createEmailVerificationNotification({
		code: user.phoneNumber,
		userEmail: user.email,
	});
	sendByMail(notification).then((_) => ApiResponse.success().send(res));
}
function checkUser(user: IUser | undefined) {
	return user ? Promise.resolve(user) : Promise.reject(AppError.ENTITY_NOT_FOUND());
}
