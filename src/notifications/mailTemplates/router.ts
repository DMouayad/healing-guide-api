import type { SignupCode } from "@/api/auth/auth.types";
import { isAdmin } from "@/api/auth/middlewares/isAdmin";
import { generateEmailVerificationTOTP } from "@/api/user/verification/utils";
import { createUser } from "@/common/factories/userFactory";
import { getExpiresAt } from "@/common/utils/dateHelpers";
import { env } from "@/common/utils/envConfig";
import { generateUserTOTP } from "@/common/utils/otp";
import type { IUser } from "@/interfaces/IUser";
import { faker } from "@faker-js/faker";
import express, { type Request, type Response } from "express";
import { MailNotification } from "../MailNotification";
import { emailVerificationMailTemplate } from "./emailVerificationTemplate";
import { identityConfirmationMailTemplate } from "./identityConfirmationTemplate";
import { signupCodeMailTemplate } from "./signupCodeTemplate";

export const mailTemplatesRouter = express.Router();
if (env.NODE_ENV !== "development") {
	mailTemplatesRouter.use(isAdmin);
}
mailTemplatesRouter.get("/email-verification", async (_req: Request, res: Response) => {
	const user = await createUser();
	const ev = generateEmailVerificationTOTP(user);
	return res.send(emailVerificationMailTemplate(ev));
});

mailTemplatesRouter.get(
	"/identity-confirmation",
	async (_req: Request, res: Response) => {
		const user = await createUser();
		const notification = createIdentityConfirmationNotification(user);
		return res.send(identityConfirmationMailTemplate(notification.userTOTP));
	},
);

mailTemplatesRouter.get("/signup-code", async (_req: Request, res: Response) => {
	return res.send(signupCodeMailTemplate(createFakeSignupCode()));
});

function createIdentityConfirmationNotification(user: IUser) {
	const totp = generateUserTOTP(
		user,
		env.IDENTITY_CONFIRMATION_CODE_LENGTH,
		env.IDENTITY_CONFIRMATION_CODE_EXPIRATION,
	);
	return MailNotification.identityConfirmation(totp);
}
function createFakeSignupCode(): SignupCode {
	return {
		code: "123456",
		email: faker.internet.email(),
		phoneNumber: faker.phone.number(),
		expiresAt: getExpiresAt(60),
	};
}
