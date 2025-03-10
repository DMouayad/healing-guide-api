import { env } from "src/common/utils/envConfig";
import { commonZodSchemas } from "src/common/zod/common";
import { z } from "zod";
import { ZodCreateSignupCodeDto } from "./auth.types";

const signupRequestSchema = z.object({
	email: z.string().email().optional(),
	phoneNumber: commonZodSchemas.phoneNumber,
	role: commonZodSchemas.role,
	password: commonZodSchemas.password,
	signupCode: z.string().length(env.SIGNUP_CODE_LENGTH),
});

const loginRequestSchema = z.object({
	emailOrPhoneNo: z.string().email().or(commonZodSchemas.phoneNumber),
	password: commonZodSchemas.password,
});

export const authRequests = {
	signup: { body: signupRequestSchema },
	login: { body: loginRequestSchema },
	confirmIdentity: {
		body: z.object({ code: z.string().length(env.IDENTITY_CONFIRMATION_CODE_LENGTH) }),
	},
	createSignupCode: { body: ZodCreateSignupCodeDto },
} as const;
