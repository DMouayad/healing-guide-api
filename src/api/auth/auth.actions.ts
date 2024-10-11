import { ActionResult } from "@/common/models/actionResult";
import AppError from "@/common/models/appError";
import { APP_ROLES, type AuthState } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { handleAction } from "@/common/utils/handleAction";
import { CreateUserDTO } from "@/interfaces/IUser";
import type { Request, Response } from "express";
import { authRequests } from "./auth.requests";
import {
	checkCredentials,
	getAuthenticatedUserApiResponse,
	issuePersonalAccessToken,
} from "./utils";

export async function signupAction(req: Request, res: Response) {
	const data = await authRequests.signup.body.parseAsync(req.body);
	const userAccountActivatedByDefault = data.role === APP_ROLES.patient;
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.create(
			new CreateUserDTO({
				...data,
				activated: userAccountActivatedByDefault,
			}),
		),
		onResult: (newUser) =>
			issuePersonalAccessToken({ user: newUser, fingerprint: req.ip! }).then((token) =>
				getAuthenticatedUserApiResponse(newUser, token?.plainTextToken),
			),
	});
}

export async function loginAction(req: Request, res: Response) {
	const data = await authRequests.login.body.parseAsync(req.body);
	await handleAction({
		res,
		resultPromise: getAppCtx().userRepository.findByEmailOrPhoneNumber(data.emailOrPhoneNo),
		onResult: (user) =>
			checkCredentials(data, user).then((isValid) => {
				if (isValid) {
					return issuePersonalAccessToken({ user: user, fingerprint: req.ip! }).then((token) =>
						getAuthenticatedUserApiResponse(user, token?.plainTextToken),
					);
				}
				return AppError.UNAUTHENTICATED();
			}),
		onResultUndefinedThrow: () => AppError.ACCOUNT_NOT_FOUND(),
	});
}

export async function logoutAction(req: Request, res: Response) {
	const authState: AuthState | undefined = res.locals.auth;
	if (!authState) {
		throw AppError.UNAUTHENTICATED();
	}
	await handleAction({
		res,
		resultPromise: getAppCtx().authTokensRepository.deleteToken(authState.personalAccessToken),
		onResult: (wasDeleted) => {
			if (wasDeleted) {
				res.locals.auth = undefined;
				return ActionResult.success();
			}
			const err = AppError.SERVER_ERROR({ description: "delete failed" });
			return ActionResult.failure({ error: err });
		},
	});
}
