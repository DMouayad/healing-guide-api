import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { myEventEmitter } from "@/common/models/myEventEmitter";
import { APP_ROLES, type AuthState, type UserTOTP } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { logger } from "@/common/utils/logger";
import { validateOTP } from "@/common/utils/otp";
import { CreateUserDTO, type IUser } from "@/interfaces/IUser";
import type { Request, Response } from "express";
import { UserRegisteredEvent } from "../user/user.events";
import { authRequests } from "./auth.requests";
import {
	checkCredentials,
	getAccessTokenApiResponse,
	getSignupApiResponse,
	getUserFromResponse,
	issuePersonalAccessToken,
} from "./utils";

export async function signupAction(req: Request, res: Response) {
	const data = await authRequests.signup.body.parseAsync(req.body);
	const userAccountActivatedByDefault = data.role === APP_ROLES.patient;
	const dto = new CreateUserDTO({
		...data,
		activated: userAccountActivatedByDefault,
	});
	return getAppCtx()
		.userRepository.create(dto)
		.then((newUser) => {
			if (!newUser) {
				return Promise.reject(AppError.SIGNUP_FAILED);
			}
			myEventEmitter.emitAppEvent(new UserRegisteredEvent(newUser));
			return Promise.resolve(newUser);
		})
		.then((newUser) =>
			issuePersonalAccessToken(newUser, req.ip!).then((token) =>
				getSignupApiResponse(newUser, token),
			),
		)
		.then((response) => response.send(res));
}

export async function loginAction(req: Request, res: Response) {
	const data = await authRequests.login.body.parseAsync(req.body);
	return getAppCtx()
		.userRepository.findByEmailOrPhoneNumber(data.emailOrPhoneNo)
		.then((user) => checkCredentials(data, user))
		.then((authUser) =>
			issuePersonalAccessToken(authUser, req.ip ?? authUser.passwordHash),
		)
		.then(getAccessTokenApiResponse)
		.then((apiResponse) => apiResponse.send(res));
}

export async function logoutAction(req: Request, res: Response) {
	const authState: AuthState | undefined = res.locals.auth;
	if (!authState) {
		throw AppError.UNAUTHENTICATED();
	}
	return getAppCtx()
		.authTokensRepository.deleteToken(authState.personalAccessToken)
		.then((wasDeleted) => {
			if (wasDeleted) {
				res.locals.auth = undefined;
				return ApiResponse.success();
			}
			return ApiResponse.error(AppError.SERVER_ERROR({ description: "delete failed" }));
		})
		.then((apiResponse) => apiResponse.send(res));
}

export async function confirmIdentityAction(req: Request, res: Response) {
	const data = await authRequests.confirmIdentity.body.parseAsync(req.body);
	const providedCode = data.code;
	const user = getUserFromResponse(res);

	return checkUser(user)
		.then(getAppCtx().identityConfirmationRepo.findBy)
		.then((identityConfirmation) => validateOTP(providedCode, identityConfirmation))
		.then((_) =>
			getAppCtx().userRepository.update(user!, { identityConfirmedAt: new Date() }),
		)
		.then((user) => {
			if (!user) {
				logger.warn("Update user result is `undefined`");
			} else {
				getAppCtx().identityConfirmationRepo.deleteAllForUser(user);
			}
		})
		.then((_) => ApiResponse.success().send(res));
}

function checkUser(user: IUser | undefined) {
	if (!user) {
		throw AppError.UNAUTHENTICATED();
	}
	return Promise.resolve(user);
}
