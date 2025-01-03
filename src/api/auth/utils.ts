import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import type { CreateAccessTokenParams, Role } from "@/common/types";
import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { generateRandomString, sha256 } from "@/common/utils/hashing";
import type { IUser } from "@/interfaces/IUser";
import { MailNotification } from "@/notifications/MailNotification";
import { SmsNotification } from "@/notifications/SmsNotification";
import { sendMailNotification, sendSmsNotification } from "@/notifications/mail.utils";
import type { OTPWithCode } from "@/otp/otp.types";
import bcrypt from "bcryptjs";
import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserResource } from "../user/user.resource";
import {
	type NewAccessToken,
	SIGNUP_CODE_SENDING_METHODS,
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
	// @ts-ignore missing property `id`on `token` => will be assigned after saving the token
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

export function getSignupApiResponse(user: IUser, token: NewAccessToken) {
	return ApiResponse.success({
		data: { token, user: UserResource.create(user) },
		statusCode: StatusCodes.CREATED,
	});
}
export function getSignupCodeUniqueIdentifier(params: {
	role: Role;
	phoneNumber: string;
	email?: string;
}) {
	const input =
		(params.email ? params.email : "") + params.phoneNumber + params.role.slug;
	return sha256(input);
}
export async function sendSignupCode(signupCode: SignupCode, otp: OTPWithCode) {
	switch (signupCode.receiveVia) {
		case SIGNUP_CODE_SENDING_METHODS.mail: {
			return sendMailNotification(MailNotification.signupCode(signupCode, otp.code));
		}
		case SIGNUP_CODE_SENDING_METHODS.sms: {
			return sendSmsNotification(SmsNotification.signupCode(signupCode));
		}
		default:
			break;
	}
}
