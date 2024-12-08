import type { IUser } from "@/interfaces/IUser";

export type EmailVerification = {
	user: IUser;
	expiresAt: Date;
	code: string;
};
