import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { myEventEmitter } from "@/common/models/myEventEmitter";
import { APP_ROLES, type AuthState } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { CreateUserDTO } from "@/interfaces/IUser";
import type { Request, Response } from "express";
import { UserRegisteredEvent } from "../user/user.events";
import { authRequests } from "./auth.requests";
import {
	checkCredentials,
	getAccessTokenApiResponse,
	getSignupApiResponse,
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
			myEventEmitter.emit(UserRegisteredEvent.name, newUser);
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
