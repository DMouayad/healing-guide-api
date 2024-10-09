import { ActionResult } from "@/common/models/actionResult";
import AppError from "@/common/models/appError";
import type { AuthState } from "@/common/types";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { handleAction } from "@/common/utils/handleAction";
import type { Request, Response } from "express";

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
