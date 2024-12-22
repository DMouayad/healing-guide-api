import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { APP_ERR_CODES } from "@/common/models/errorCodes";
import { myEventEmitter } from "@/common/models/myEventEmitter";
import { APP_ROLES, type AuthState } from "@/common/types";
import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { logUserUpdateResultIsUndefined } from "@/common/utils/logger";
import { generateOTP, validateOTP } from "@/common/utils/otp";
import { CreateUserDTO, type IUser } from "@/interfaces/IUser";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRegisteredEvent } from "../user/user.events";
import { authRequests } from "./auth.requests";
import type { SignupCode } from "./auth.types";
import {
	checkCredentials,
	getAccessTokenApiResponse,
	getSignupApiResponse,
	getUserFromResponse,
	issuePersonalAccessToken,
	sendSignupCode,
} from "./utils";

export async function signupAction(req: Request, res: Response) {
	const data = await authRequests.signup.body.parseAsync(req.body);
	const userAccountActivatedByDefault = data.role === APP_ROLES.patient;

	const dto = new CreateUserDTO({
		...data,
		activated: userAccountActivatedByDefault,
		identityConfirmedAt: new Date(),
	});
	// find the signup code associated with the user credentials
	const storedCode = await getAppCtx().signupCodesRepository.find({
		email: data.email,
		phoneNumber: data.phoneNumber,
	});
	if (!storedCode) {
		return ApiResponse.error(
			AppError.SERVER_ERROR({ errCode: APP_ERR_CODES.MISSING_SIGNUP_CODE }),
		).send(res);
	}
	await validateOTP(data.signupCode, storedCode);

	getAppCtx()
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
		.then(async (authUser) => {
			const user = await getAppCtx().userRepository.update(authUser, {
				identityConfirmedAt: new Date(),
			});
			if (!user) {
				logUserUpdateResultIsUndefined();
			}
			return user ?? authUser;
		})
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

export async function createSignupCodeAction(req: Request, res: Response) {
	const data = await authRequests.createSignupCode.body.parseAsync(req.body);

	return getAppCtx()
		.userRepository.verifyCredentialsAreUnique(data.phoneNumber, data.email)
		.then((isUnique) => {
			if (isUnique) {
				const otp = generateOTP(env.SIGNUP_CODE_LENGTH);
				const signupCode: SignupCode = {
					code: otp,
					expiresAt: getExpiresAt(env.SIGNUP_CODE_EXPIRATION),
					email: data.email,
					phoneNumber: data.phoneNumber,
					username: data.username,
				};
				return getAppCtx()
					.signupCodesRepository.store(signupCode)
					.then((storedCode) => sendSignupCode(storedCode, data.receiveVia))
					.then((_) => ApiResponse.success({ statusCode: StatusCodes.CREATED }));
			}
			return ApiResponse.error(AppError.ACCOUNT_ALREADY_EXISTS());
		})
		.then((response) => response.send(res));
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
				logUserUpdateResultIsUndefined();
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
