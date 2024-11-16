import { validatePhoneNo } from "@/common/utils/validators";
import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

// Input Validation for 'GET users/:id' endpoint
const requestWithUserIdParamSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
});

const updateUserReqBody = z.object({
	fullName: z.string(),
	email: z.string().email(),
	phoneNumber: z.string().transform(validatePhoneNo),
	activated: z.boolean(),
});
export const updateUserRequestSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
	body: z.union([
		updateUserReqBody,
		updateUserReqBody.partial({ activated: true }),
		updateUserReqBody.partial({ activated: true, fullName: true }),
		updateUserReqBody.partial({ activated: true, fullName: true, email: true }),
	]),
});
const verifyEmailRequestSchema = z.object({
	params: z.object({
		id: commonZodSchemas.id,
	}),
});
export const userRequests = {
	get: requestWithUserIdParamSchema,
	delete: requestWithUserIdParamSchema,
	update: updateUserRequestSchema,
	changeActivation: requestWithUserIdParamSchema,
	verifyEmail: verifyEmailRequestSchema,
} as const;
