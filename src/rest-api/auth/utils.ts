import bcrypt from "bcryptjs";
import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	sendMailNotification,
	sendSmsNotification,
} from "src//notifications/mail.utils";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import type { CreateAccessTokenParams, Role } from "src/common/types";
import { getExpiresAt } from "src/common/utils/dateHelpers";
import { env } from "src/common/utils/envConfig";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { generateRandomString, sha256 } from "src/common/utils/hashing";
import type { IUser } from "src/interfaces/IUser";
import { MailNotification } from "src/notifications/MailNotification";
import { SmsNotification } from "src/notifications/SmsNotification";
import type { OTPWithCode } from "src/otp/otp.types";
import { UserResource } from "../user/user.resource";
import {
	type NewAccessToken,
	OTP_SENDING_METHODS,
	type SignupCode,
} from "./auth.types";
export async function checkCredentials(
	creds: { emailOrPhoneNo: string; password: string },
	existingUser?: IUser,
): Promise<boolean> {
	if (
		creds.emailOrPhoneNo === existingUser?.email ||
		creds.emailOrPhoneNo === existingUser?.phoneNumber
	) {
		return await bcrypt.compare(creds.password, existingUser?.passwordHash);
	}
	return false;
}

export async function issuePersonalAccessToken(
	user: IUser,
	fingerprint: string,
	expirationInMinutes?: number,
) {
	// delete previous token(s) of user - if any
	return getAppCtx()
		.authTokensRepository.deleteUserTokens(user.id)
		.then((_) =>
			createToken({
				tokenableId: user.id,
				name: fingerprint,
				expirationInMinutes,
			}),
		);
}

async function createToken(params: CreateAccessTokenParams): Promise<NewAccessToken> {
	const plainTextToken = generateRandomString(50);
	const token = {
		userId: params.tokenableId,
		hash: sha256(plainTextToken),
		fingerprint: params.name,
		createdAt: new Date(),
		expiresAt: getExpiresAt(
			params.expirationInMinutes ?? env.PERSONAL_ACCESS_TOKEN_EXPIRATION,
		),
	};
	// src/ts-ignore missing property `id`on `token` => will be assigned after saving the token
	const tokenId = await getAppCtx().authTokensRepository.storeToken(token);
	if (!tokenId) {
		throw AppError.UNAUTHENTICATED();
	}
	return `${tokenId}|${plainTextToken}`;
}

export function getUserFromResponse(res: Response, throwIfUndefined?: true): IUser;
export function getUserFromResponse(
	res: Response,
	throwIfUndefined: false,
): IUser | undefined;

export function getUserFromResponse(
	res: Response,
	throwIfUndefined = true,
): IUser | undefined {
	const user = res.locals.auth?.user;
	if (!user && throwIfUndefined) {
		throw AppError.UNAUTHENTICATED();
	}
	return user;
}

export function getAccessTokenApiResponse(token: NewAccessToken) {
	return ApiResponse.success({ data: { token } });
}

export function getAuthorizedUserApiResponse(
	user: IUser,
	token: NewAccessToken,
	newUser = false,
) {
	return ApiResponse.success({
		data: { token, user: UserResource(user) },
		statusCode: newUser ? StatusCodes.CREATED : StatusCodes.OK,
	});
}

export function getSignupCodeUniqueIdentifier(params: {
	role: Role;
	phoneNumber: string;
	email?: string | null;
}) {
	const input =
		(params.email ? params.email : "") + params.phoneNumber + params.role.slug;
	return sha256(input);
}

export async function sendSignupCode(signupCode: SignupCode, otp: OTPWithCode) {
	switch (signupCode.receiveVia) {
		case OTP_SENDING_METHODS.mail: {
			return sendMailNotification(MailNotification.signupCode(signupCode, otp.code));
		}
		case OTP_SENDING_METHODS.sms: {
			return sendSmsNotification(SmsNotification.signupCode(signupCode));
		}
		default:
			break;
	}
}
