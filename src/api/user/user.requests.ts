import { env } from "@/common/utils/envConfig";
import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

const updateUserReqBody = z.object({
	email: z.string().email(),
	phoneNumber: commonZodSchemas.phoneNumber,
});

export const updateUserRequestSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
	body: z.union([
		updateUserReqBody,
		updateUserReqBody.omit({ email: true }),
		updateUserReqBody.omit({ phoneNumber: true }),
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
	get: commonZodSchemas.requestIdParam,
	delete: commonZodSchemas.requestIdParam,
	update: updateUserRequestSchema,
	updateActivation: updateUserActivationStatusRequestSchema,
	verifyEmail: z.object({
		code: z.string().length(env.EMAIL_VERIFICATION_CODE_LENGTH),
	}),
	verifyPhone: z.object({
		code: z.string().length(env.PHONE_VERIFICATION_CODE_LENGTH),
	}),
} as const;
