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
});

export const updateUserRequestSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
	body: z.union([
		updateUserReqBody,
		updateUserReqBody.omit({ fullName: true }),
		updateUserReqBody.omit({ email: true }),
		updateUserReqBody.omit({ phoneNumber: true }),
		updateUserReqBody.pick({ fullName: true }),
		updateUserReqBody.pick({ phoneNumber: true }),
		updateUserReqBody.pick({ email: true }),
	]),
});
const updateUserActivationStatusRequestSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
	body: z.object({
		activated: z.boolean(),
	}),
});
export const userRequests = {
	get: requestWithUserIdParamSchema,
	delete: requestWithUserIdParamSchema,
	update: updateUserRequestSchema,
	updateActivation: updateUserActivationStatusRequestSchema,
	verifyEmail: requestWithUserIdParamSchema,
} as const;
