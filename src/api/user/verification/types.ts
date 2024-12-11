import type { IUser } from "@/interfaces/IUser";

export type VerificationCode = {
	user: IUser;
	expiresAt: Date;
	code: string;
};
