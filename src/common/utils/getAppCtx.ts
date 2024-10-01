import { AuthTokensService } from "@/api/auth/authTokensService";
import { UserService } from "@/api/user/user.service";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userService: new UserService(),
	authTokensService: new AuthTokensService(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
