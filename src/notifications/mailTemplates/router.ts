import { isAdmin } from "@/api/auth/middlewares/isAdmin";
import { generateEmailVerification } from "@/api/user/verification/utils";
import { createUser } from "@/common/factories/userFactory";
import { env } from "@/common/utils/envConfig";
import { generateOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";
import express, { type Request, type Response } from "express";
import { IdentityConfirmationNotification } from "../MailNotification";
import { emailVerificationMailTemplate } from "./emailVerificationTemplate";
import { identityConfirmationMailTemplate } from "./identityConfirmationTemplate";

export const mailTemplatesRouter = express.Router();
if (env.NODE_ENV !== "development") {
	mailTemplatesRouter.use(isAdmin);
}
mailTemplatesRouter.get("/email-verification", async (_req: Request, res: Response) => {
	const user = await createUser();
	const ev = generateEmailVerification(user);
	return res.send(emailVerificationMailTemplate(ev));
});

mailTemplatesRouter.get(
	"/identity-confirmation",
	async (_req: Request, res: Response) => {
		const user = await createUser();
		const notification = createIdentityConfirmationNotification(user);
		return res.send(identityConfirmationMailTemplate(notification));
	},
);

function createIdentityConfirmationNotification(
	user: IUser,
): IdentityConfirmationNotification {
	const otp = generateOTP(env.IDENTITY_CONFIRMATION_CODE_LENGTH);
	const identityConfirmation = {
		user,
		code: otp,
		expiresAt: new Date(),
	};
	return new IdentityConfirmationNotification(identityConfirmation);
}
