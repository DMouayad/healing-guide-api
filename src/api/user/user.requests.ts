import { validatePhoneNo } from "@/common/utils/validators";
import { commonZodSchemas } from "@/common/utils/zodSchemas";
import { z } from "zod";

// Input Validation for 'GET users/:id' endpoint
const getUserRequestSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
});
const deleteUserRequestSchema = z.object({
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
export const userRequests = {
	get: getUserRequestSchema,
	delete: deleteUserRequestSchema,
	update: updateUserRequestSchema,
} as const;
