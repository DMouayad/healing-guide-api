import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validatePhoneNo } from "@/common/utils/validators";
import { userRequests } from "./user.requests";

extendZodWithOpenApi(z);

export const userRegistry = new OpenAPIRegistry();
export const UserSchema = z.object({
	id: z.number(),
	activated: z.boolean().default(false),
	fullName: z.string(),
	email: z.string().email(),
	phoneNumber: z.string().transform(validatePhoneNo),
	createdAt: z.string().datetime(),
	emailVerifiedAt: z.string().datetime().optional(),
	phoneNumberVerifiedAt: z.string().datetime().optional(),
});

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: userRequests.get.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});
