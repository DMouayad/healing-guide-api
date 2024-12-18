import { env } from "@/common/utils/envConfig";
import { validatePhoneNo, validateRole } from "@/common/utils/validators";
import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

const signupRequestSchema = z
	.object({
		fullName: z.string(),
		email: z.string().email(),
		phoneNumber: z.string().transform(validatePhoneNo),
		role: z.string().transform(validateRole),
		password: commonZodSchemas.password,
	})
	.required();

const loginRequestSchema = z.object({
	emailOrPhoneNo: z.string().email().or(z.string().transform(validatePhoneNo)),
	password: commonZodSchemas.password,
});
export const authRequests = {
	signup: { body: signupRequestSchema },
	login: { body: loginRequestSchema },
	confirmIdentity: z.object({
		body: z.object({ code: z.string().length(env.IDENTITY_CONFIRMATION_CODE_LENGTH) }),
	}),
} as const;
