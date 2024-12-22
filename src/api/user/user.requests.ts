import { env } from "@/common/utils/envConfig";
import { validatePhoneNo } from "@/common/utils/validators";
import { commonZodSchemas, requestWithIdParamSchema } from "@/common/zod/common";
import { z } from "zod";

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
const userVerificationRequestSchema = z.object({
	body: z.object({ code: z.string().length(env.EMAIL_VERIFICATION_CODE_LENGTH) }),
});
export const userRequests = {
	get: requestWithIdParamSchema,
	delete: requestWithIdParamSchema,
	update: updateUserRequestSchema,
	updateActivation: updateUserActivationStatusRequestSchema,
	verifyEmail: userVerificationRequestSchema,
	verifyPhone: userVerificationRequestSchema,
} as const;
