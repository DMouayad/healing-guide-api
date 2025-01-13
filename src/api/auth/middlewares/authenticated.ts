import AppError from "@common/models/appError";
import type { AuthState, ExtractedBearerToken } from "@common/types";
import { getAppCtx } from "@common/utils/getAppCtx";
import type { NextFunction, Request, Response } from "express";
import type { AccessToken } from "../../../common/models/accessToken";

export async function authenticated(req: Request, _res: Response, next: NextFunction) {
	const bearerToken = extractBearerToken(req);
	if (!bearerToken) {
		throw AppError.UNAUTHENTICATED({ description: "Bearer Token required" });
	}
	const [token, user] =
		await getAppCtx().authTokensRepository.findTokenAndUser(bearerToken);
	if (isExpired(token)) {
		throw AppError.INVALID_ACCESS_TOKEN();
	}

	// attach the user and token to response locals object
	const authState: AuthState = { user: user, personalAccessToken: token };
	_res.locals.auth = authState;
	next();
}

function isExpired(token: AccessToken) {
	return token.expiresAt.valueOf() < Date.now();
}
function extractBearerToken(req: Request): ExtractedBearerToken | undefined {
	const headerValue = req.headers.authorization || req.headers.Authorization;
	if (typeof headerValue !== "string") {
		return;
	}

	const plainTextToken = headerValue.split("Bearer ", 2).at(1);

	if (!plainTextToken) {
		return;
	}

	const canExtractId = plainTextToken.includes("|");

	if (canExtractId) {
		const [id, tokenStr] = plainTextToken.split("|", 2);
		const parsedId = Number.parseInt(id, 10);
		if (!Number.isNaN(parsedId)) {
			return { tokenId: parsedId, tokenStr: tokenStr };
		}
	}
	if (validateTokenValue(plainTextToken)) {
		return { tokenStr: plainTextToken };
	}
}
function validateTokenValue(token: string) {
	return /^[a-zA-Z0-9]{64}$/.test(token);
}
