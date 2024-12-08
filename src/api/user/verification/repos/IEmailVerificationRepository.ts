import type { IUser } from "@/interfaces/IUser";
import type { EmailVerification } from "../types";

export interface IEmailVerificationRepository {
	storeEmailVerification(
		emailVerification: EmailVerification,
	): Promise<EmailVerification>;
	findBy(user: IUser): Promise<EmailVerification | undefined>;
}
