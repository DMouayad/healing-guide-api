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
export const updateUserRequestSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
	body: z.object({
		fullName: z.string().optional(),
		email: z.string().email().optional(),
		phoneNumber: z.string().transform(validatePhoneNo).optional(),
	}),
});
export const userRequests = {
	get: getUserRequestSchema,
	delete: deleteUserRequestSchema,
	update: updateUserRequestSchema,
} as const;
