import { env } from "@/common/utils/envConfig";
import { validateRole } from "@/common/utils/validators";
import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";
import { SIGNUP_CODE_SENDING_METHODS } from "./auth.types";

const signupRequestSchema = z
	.object({
		email: z.string().email(),
		phoneNumber: commonZodSchemas.phoneNumber,
		role: z.string().transform(validateRole),
		password: commonZodSchemas.password,
		signupCode: z.string().length(env.SIGNUP_CODE_LENGTH),
	})
	.required();

const loginRequestSchema = z.object({
	emailOrPhoneNo: z.string().email().or(commonZodSchemas.phoneNumber),
	password: commonZodSchemas.password,
});
const createSignupCodeRequestSchema = z
	.object({
		email: z.string().email().optional(),
		phoneNumber: commonZodSchemas.phoneNumber,
		receiveVia: z.literal(SIGNUP_CODE_SENDING_METHODS.sms),
	})
	.or(
		z.object({
			email: z.string().email(),
			phoneNumber: commonZodSchemas.phoneNumber,
			receiveVia: z.literal(SIGNUP_CODE_SENDING_METHODS.mail),
		}),
	);
export const authRequests = {
	signup: { body: signupRequestSchema },
	login: { body: loginRequestSchema },
	confirmIdentity: {
		body: z.object({ code: z.string().length(env.IDENTITY_CONFIRMATION_CODE_LENGTH) }),
	},
	createSignupCode: {
		body: createSignupCodeRequestSchema,
	},
} as const;
