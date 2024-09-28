import type { IUser } from "@/interfaces/IUser";
import type { IUserService } from "@/interfaces/IUserService";

export type AppCtx = {
	readonly userService: IUserService<IUser>;
};
