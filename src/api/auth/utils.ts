import { randomBytes } from "node:crypto";
import type { CreateAccessTokenParams, NewAccessToken } from "@/common/types";
import { env } from "@/common/utils/envConfig";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { sha256 } from "@/common/utils/hashing";

function getExpiresAt(expirationInMinutes?: number) {
	const expiresIn = expirationInMinutes ?? env.PERSONAL_ACCESS_TOKEN_EXPIRATION;
	const createdAt = new Date();
	const expiresAt = new Date();
	expiresAt.setTime(createdAt.getTime() + expiresIn * 60000);
	return expiresAt;
}
function generateTokenString() {
	return randomBytes(50).toString("base64");
}

export async function createAccessToken(params: CreateAccessTokenParams): Promise<NewAccessToken | undefined> {
	const plainTextToken = generateTokenString();
	const token = {
		userId: params.tokenableId,
		hash: sha256(plainTextToken),
		fingerprint: params.name,
		abilities: params.abilities ?? null,
		createdAt: new Date(),
		expiresAt: getExpiresAt(params.expirationInMinutes),
	};
	const tokenId = await getAppCtx().AuthTokensRepository.storeToken(token);
	if (tokenId) {
		return {
			token,
			plainTextToken: `${tokenId}|${plainTextToken}`,
		};
	}
}
