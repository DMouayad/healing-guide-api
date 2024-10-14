import { userRequests } from "@/api/user/user.requests";
import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { getUserSignature } from "@/common/utils/urlSigning";
import type { NextFunction, Request, Response } from "express";

export async function signedURL(req: Request, res: Response, next: NextFunction) {
	const data = await userRequests.verifyEmail.parseAsync({
		params: req.params,
		query: req.query,
	});
	const user = await getAppCtx().userRepository.find(data.params.id);
	if (!user) {
		throw AppError.FORBIDDEN();
	}
	res.locals.user = user;
	return getUserSignature(user).verifier()(req, res, next);
}
