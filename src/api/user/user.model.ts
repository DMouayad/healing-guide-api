import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserRequestSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
export const DeleteUserRequestSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
export const requests = { get: GetUserRequestSchema, delete: DeleteUserRequestSchema };