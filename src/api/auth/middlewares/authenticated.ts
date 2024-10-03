import AppError from "@/common/models/appError";
import type { AuthState, ExtractedBearerToken } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import type { NextFunction, Request, Response } from "express";
import type { AccessToken } from "../../../common/models/accessToken";

export async function authenticated(req: Request, _res: Response, next: NextFunction) {
	const bearerToken = extractBearerToken(req);
	if (!bearerToken) {
		throw AppError.UNAUTHORIZED({ description: "Bearer Token required" });
	}
	const [token, user] = await getAppCtx().authTokensRepository.findTokenAndUser(bearerToken);
	if (isExpired(token)) {
		throw AppError.INVALID_ACCESS_TOKEN({ description: "Token expired" });
	}

	// attach the user and token to response locals object
	const authState: AuthState = { user: user, personalAccessToken: token };
	_res.locals.auth = authState;
	next();
}

function isExpired(token: AccessToken) {
	return token.expiresAt < new Date();
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
		if (id && validateId(id)) {
			return { tokenId: id, tokenStr: tokenStr };
		}
	}
	if (validateTokenValue(plainTextToken)) {
		return { tokenStr: plainTextToken };
	}
}
function validateTokenValue(token: string) {
	return /^[a-zA-Z0-9]{64}$/.test(token);
}
function validateId(id: string) {
	const parsedId = Number.parseInt(id, 0);
	return !Number.isNaN(parsedId);
}
