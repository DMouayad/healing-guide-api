import { ActionResult } from "@/common/models/actionResult";
import AppError from "@/common/models/appError";
import type { CreateAccessTokenParams, NewAccessToken } from "@/common/types";
import { env } from "@/common/utils/envConfig";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { generateRandomString, sha256 } from "@/common/utils/hashing";
import type { IUser } from "@/interfaces/IUser";
import { UserResource } from "@/resources/userResource";
import bcrypt from "bcryptjs";

export async function checkCredentials(
	creds: { emailOrPhoneNo: string; password: string },
	existingUser: IUser,
) {
	if (
		creds.emailOrPhoneNo === existingUser.email ||
		creds.emailOrPhoneNo === existingUser.phoneNumber
	) {
		return bcrypt.compare(creds.password, existingUser.passwordHash);
	}
	return false;
}
export function getAuthenticatedUserApiResponse(user: IUser, plainTextToken?: string) {
	if (plainTextToken) {
		return ActionResult.success({
			responseObject: {
				user: UserResource.create(user),
				token: plainTextToken,
			},
		});
	}
	return AppError.UNAUTHENTICATED();
}
export async function issuePersonalAccessToken({
	user,
	fingerprint,
	expirationInMinutes,
}: { user: IUser; fingerprint: string; expirationInMinutes?: number }) {
	// delete previous token(s) of user - if any
	return getAppCtx()
		.authTokensRepository.deleteUserTokens(user.id)
		.then((_) => createToken({ tokenableId: user.id, name: fingerprint, expirationInMinutes }));
}

async function createToken(
	params: CreateAccessTokenParams,
): Promise<NewAccessToken | undefined> {
	const plainTextToken = generateRandomString(50);
	const token = {
		userId: params.tokenableId,
		hash: sha256(plainTextToken),
		fingerprint: params.name,
		createdAt: new Date(),
		expiresAt: getExpiresAt(params.expirationInMinutes),
	};
	// @ts-ignore missing property `id`on `token` => will be assigned after saving the token
	const tokenId = await getAppCtx().authTokensRepository.storeToken(token);
	if (tokenId) {
		return {
			token: {
				...token,
				id: tokenId,
			},
			plainTextToken: `${tokenId}|${plainTextToken}`,
		};
	}
}
function getExpiresAt(expirationInMinutes?: number) {
	const expiresIn = expirationInMinutes ?? env.PERSONAL_ACCESS_TOKEN_EXPIRATION;
	const createdAt = new Date();
	const expiresAt = new Date();
	expiresAt.setTime(createdAt.getTime() + expiresIn * 60000);
	return expiresAt;
}
