import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import { APP_ERR_CODES } from "src/common/models/errorCodes";
import { myEventEmitter } from "src/common/models/myEventEmitter";
import {
	type MultipleRateLimiters,
	checkRateLimitsHavePoints,
	consumeByIP,
} from "src/common/rateLimiters";
import { APP_ROLES, type AuthState } from "src/common/types";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { getClientIp } from "src/common/utils/getClientIp";
import { bcryptHash } from "src/common/utils/hashing";
import { logUserUpdateResultIsUndefined } from "src/common/utils/logger";
import { CreateUserDTO } from "src/interfaces/IUser";
import { getCredsRateLimitingKey } from "src/middleware/rateLimiter";
import { OTP_PURPOSES } from "src/otp/otp.types";
import {
	generateOTP,
	validateIdentityConfirmationCode,
	validateSignupCode,
} from "src/otp/otp.utils";
import {
	checkCredentials,
	getAuthorizedUserApiResponse,
	getSignupCodeUniqueIdentifier,
	getUserFromResponse,
	issuePersonalAccessToken,
	sendSignupCode,
} from "src/rest-api/auth/utils";
import { UserRegisteredEvent } from "../user/user.events";
import { authRequests } from "./auth.requests";

export function signupAction(limiters: MultipleRateLimiters) {
	return async (req: Request, res: Response, _: NextFunction) => {
		const data = authRequests.signup.body.parse(req.body);
		const credsLimiterKey = getCredsRateLimitingKey(data);
		await checkRateLimitsHavePoints(req, credsLimiterKey, limiters);

		try {
			await validateSignupCode({ code: data.signupCode, ...data });
		} catch (err) {
			if (
				err instanceof AppError &&
				err.errCode in [APP_ERR_CODES.INVALID_OTP, APP_ERR_CODES.EXPIRED_OTP]
			) {
				// Consume points if signup code is invalid or expired
				await consumeByIP(limiters.byIP, req);
				await limiters.byCredentials.consume(credsLimiterKey);
			}
			throw err; // Re-throw
		}
		const userAccountActivatedByDefault = data.role === APP_ROLES.patient;
		const passwordHash = await bcryptHash(data.password);

		const dto = new CreateUserDTO({
			email: data.email,
			phoneNumber: data.phoneNumber,
			role: data.role,
			activated: userAccountActivatedByDefault,
			identityConfirmedAt: new Date(),
			passwordHash,
		});
		const newUser = await getAppCtx().userRepository.create(dto);
		if (!newUser) {
			await consumeByIP(limiters.byIP, req);
			await limiters.byCredentials.consume(credsLimiterKey);
			throw AppError.SIGNUP_FAILED();
		}
		// clear limiter points on signup success
		await limiters.byCredentials.delete(credsLimiterKey);

		myEventEmitter.emitAppEvent(new UserRegisteredEvent(newUser));

		const token = await issuePersonalAccessToken(newUser, req.ip!);
		return getAuthorizedUserApiResponse(newUser, token, true).send(res);
	};
}

export function loginAction(limiters: MultipleRateLimiters) {
	return async (req: Request, res: Response, _: NextFunction) => {
		const data = await authRequests.login.body.parseAsync(req.body);

		await checkRateLimitsHavePoints(req, data.emailOrPhoneNo, limiters);

		const user = await getAppCtx().userRepository.findByEmailOrPhoneNumber(
			data.emailOrPhoneNo,
		);
		if (!user) {
			await consumeByIP(limiters.byIP, req);
			throw AppError.WRONG_LOGIN_CREDS();
		}

		const credsAreValid = await checkCredentials(data, user);
		if (credsAreValid) {
			await limiters.byCredentials.delete(data.emailOrPhoneNo);
			await getAppCtx().userRepository.update(user, {
				identityConfirmedAt: new Date(),
			});
			const tokenFingerPrint = getClientIp(req) ?? `${user.id}_${Date.now()}`;
			const token = await issuePersonalAccessToken(user, tokenFingerPrint);
			return getAuthorizedUserApiResponse(user, token).send(res);
		} else {
			await consumeByIP(limiters.byIP, req);
			await limiters.byCredentials.consume(data.emailOrPhoneNo);
			throw AppError.WRONG_LOGIN_CREDS();
		}
	};
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
	const isUnique = await getAppCtx().userRepository.verifyCredentialsAreUnique(
		data.phoneNumber,
		data.email,
	);

	if (!isUnique) {
		return ApiResponse.error(AppError.ACCOUNT_ALREADY_EXISTS()).send(res);
	}
	await getAppCtx().otpRepository.delete(
		getSignupCodeUniqueIdentifier(data),
		OTP_PURPOSES.signupConfirmation,
	);
	const otp = generateOTP({
		length: env.SIGNUP_CODE_LENGTH,
		expirationInMinutes: env.SIGNUP_CODE_EXPIRATION,
		issuedFor: getSignupCodeUniqueIdentifier(data),
		purpose: OTP_PURPOSES.signupConfirmation,
	});

	return getAppCtx()
		.otpRepository.store(otp)
		.then((storedOtp) => sendSignupCode(data, otp))
		.then((_) => ApiResponse.success({ statusCode: StatusCodes.CREATED }))
		.then((response) => response.send(res));
}
export async function confirmIdentityAction(req: Request, res: Response) {
	const data = await authRequests.confirmIdentity.body.parseAsync(req.body);
	const user = getUserFromResponse(res);

	return validateIdentityConfirmationCode(data.code, user)
		.then((_) =>
			getAppCtx().userRepository.update(user!, { identityConfirmedAt: new Date() }),
		)
		.then((user) => {
			if (!user) {
				logUserUpdateResultIsUndefined();
			}
		})
		.then((_) => ApiResponse.success().send(res));
}
