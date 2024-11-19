import { userRoutes } from "@/api/user/user.router";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { ZodAppErrorSchema } from "@/common/zod/appError.zod";
import { UserSchema } from "@/common/zod/user.zod";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { createApiResponses } from "./openAPIResponseBuilders";

extendZodWithOpenApi(z);

const baseURL = "/api/v1";
const unauthenticatedResponse = {
	statusCode: StatusCodes.UNAUTHORIZED,
	description: "Failure: unauthenticated user",
	schema: ZodAppErrorSchema,
	example: ApiResponse.error(AppError.UNAUTHENTICATED()),
};
const unauthorizedResponse = {
	statusCode: StatusCodes.FORBIDDEN,
	description: "Failure: unauthorized user",
	schema: ZodAppErrorSchema,
	example: ApiResponse.error(AppError.FORBIDDEN()),
};

const requestIdParam = {
	params: z.object({ id: z.string() }),
};
const usersRoute = `${baseURL}/users`;
/**
 * User Endpoints
 */
export const userRegistry = new OpenAPIRegistry();
userRegistry.register("User", UserSchema);
const bearerAuth = userRegistry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	bearerFormat: "JWT",
});

/**
 * Admin only endpoints
 */
export const adminOnlyRegistry = new OpenAPIRegistry();

adminOnlyRegistry.registerPath({
	method: "get",
	description: "To retrieve a list of users registered in the app, excluding admins",
	path: `${usersRoute + userRoutes.index}`,
	tags: ["Admin Only"],
	security: [{ [bearerAuth.name]: [] }],
	responses: createApiResponses([
		{
			statusCode: StatusCodes.OK,
			description: "Success: returns a list of users",
			schema: z.array(UserSchema),
		},
		unauthenticatedResponse,
		unauthorizedResponse,
	]),
});

adminOnlyRegistry.registerPath({
	method: "patch",
	path: `${usersRoute + userRoutes.updateActivationStatus("{id}")}`,
	description: "To change the activation status of a user",
	tags: ["Admin Only"],
	request: {
		...requestIdParam,
		body: {
			content: {
				"application/json": {
					schema: z.object({
						activated: z.boolean(),
					}),
				},
			},
		},
	},
	security: [{ [bearerAuth.name]: [] }],
	responses: createApiResponses([unauthenticatedResponse, unauthorizedResponse]),
});
