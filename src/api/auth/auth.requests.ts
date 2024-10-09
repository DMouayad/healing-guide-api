import { APP_ROLES } from "@/common/types";
import { validatePhoneNo } from "@/common/utils/validators";
import { commonZodSchemas } from "@/common/utils/zodSchemas";
import { z } from "zod";

const signupRequestSchema = z
	.object({
		fullName: z.string(),
		email: z.string().email(),
		phoneNumber: z.string().transform(validatePhoneNo),
		role: z.string().refine((value) => {
			return Array.from([
				APP_ROLES.patient.slug as string,
				APP_ROLES.physician.slug as string,
			]).includes(value);
		}, "Role not found"),
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
} as const;
