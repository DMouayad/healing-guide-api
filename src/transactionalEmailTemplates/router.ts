import {
	MailNotification,
	SignupCodeMailNotification,
} from "@/notifications/MailNotification";
import {
	generateEmailVerificationOTP,
	generateIdentityConfirmationOTP,
} from "@/otp/otp.utils";
import {
	generatePasswordResetLink,
	generatePasswordResetToken,
} from "@/passwordReset/passwordReset.utils";
import { OTP_SENDING_METHODS } from "@api/auth/auth.types";
import { isAdmin } from "@api/auth/middlewares/isAdmin";
import { createUser } from "@common/factories/userFactory";
import { APP_ROLES } from "@common/types";
import { env } from "@common/utils/envConfig";
import { faker } from "@faker-js/faker";
import express, { type Request, type Response } from "express";
import { emailVerificationMailTemplate } from "./emailVerificationTemplate";
import { identityConfirmationMailTemplate } from "./identityConfirmationTemplate";
import { passwordResetMailTemplate } from "./passwordResetTemplate";
import { signupCodeMailTemplate } from "./signupCodeTemplate";

export const mailTemplatesRouter = express.Router();
if (env.NODE_ENV !== "development") {
	mailTemplatesRouter.use(isAdmin);
}
mailTemplatesRouter.get("/email-verification", async (_req: Request, res: Response) => {
	const user = await createUser();
	const otp = generateEmailVerificationOTP(user);
	const notification = MailNotification.emailVerification(user, otp);
	return res.send(emailVerificationMailTemplate(notification));
});

mailTemplatesRouter.get(
	"/identity-confirmation",
	async (_req: Request, res: Response) => {
		const user = await createUser();
		const otp = generateIdentityConfirmationOTP(user);

		const notification = MailNotification.identityConfirmation(user, otp);
		return res.send(identityConfirmationMailTemplate(notification));
	},
);

mailTemplatesRouter.get("/signup-code", async (_req: Request, res: Response) => {
	const notification = new SignupCodeMailNotification(createFakeSignupCode(), "1234");
	return res.send(signupCodeMailTemplate(notification));
});
mailTemplatesRouter.get("/password-reset", async (req, res) => {
	const user = await createUser();
	const pr = generatePasswordResetToken(user.phoneNumber);
	const otp = generatePasswordResetLink(pr.token);

	const notification = MailNotification.passwordReset(user, otp);
	return res.send(passwordResetMailTemplate(notification));
});
function createFakeSignupCode() {
	return {
		email: faker.internet.email(),
		phoneNumber: faker.phone.number(),
		receiveVia: OTP_SENDING_METHODS.mail,
		role: APP_ROLES.patient,
	};
}
OTP_SENDING_METHODS;
