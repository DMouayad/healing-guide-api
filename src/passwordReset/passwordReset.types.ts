import { OTP_SENDING_METHODS } from "@/api/auth/auth.types";
import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export const ZodPasswordReset = z.object({
	token: z.string(),
	hash: z.string(),
	issuedFor: z.string().email().or(commonZodSchemas.phoneNumber),
	expiresAt: z.date(),
});
export type PasswordReset = z.infer<typeof ZodPasswordReset>;
export const ZodPasswordResetDTO = ZodPasswordReset.omit({ hash: true });
export type PasswordResetDTO = z.infer<typeof ZodPasswordResetDTO>;

export const forgotPasswordRequest = {
	body: z
		.object({
			phone: commonZodSchemas.phoneNumber,
			receiveVia: z.literal(OTP_SENDING_METHODS.sms),
		})
		.or(
			z.object({
				email: z.string().email(),
				receiveVia: z.literal(OTP_SENDING_METHODS.mail),
			}),
		),
};
export const resetPasswordRequest = {
	params: z.object({ token: z.string() }),
	body: z
		.object({
			password: commonZodSchemas.password,
			passwordConfirmation: commonZodSchemas.password,
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: "Passwords don't match",
			path: ["passwordConfirmation"],
		}),
};
