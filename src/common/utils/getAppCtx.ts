import { UserService } from "@/api/user/user.service";
import type { AppCtx } from "../models/appCtx";

const productionAppCtx: AppCtx = {
	userService: new UserService(),
} as const;

export function getAppCtx(): AppCtx {
	return productionAppCtx;
}
