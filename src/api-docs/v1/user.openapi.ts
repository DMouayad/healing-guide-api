import { userRoutes } from "@/api/user/user.router";
import { UserSchema } from "@/common/zod/user.zod";
import {
	type OpenAPIRegistry,
	extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import {
	requestIdParam,
	unauthenticatedResponse,
	unauthorizedResponse,
} from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";
extendZodWithOpenApi(z);

export function registerUserPaths(registry: OpenAPIRegistry, baseUrl: string) {
	const usersRoute = `${baseUrl}/users`;
	registry.register("User", UserSchema);

	registry.registerPath({
		method: "post",
		description: "Used when a user request to verify his email",
		path: `${usersRoute + userRoutes.verifyEmail("{id}")}`,
		tags: ["User"],
		request: {
			...requestIdParam,
			body: {
				content: {
					"application/json": {
						schema: z.object({
							verificationCode: z.string(),
						}),
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: email was verified successfully",
			},
		]),
	});
	/**
	 * Admin only endpoints
	 */

	registry.registerPath({
		method: "get",
		description: "To retrieve a list of users registered in the app, excluding admins",
		path: `${usersRoute + userRoutes.index}`,
		tags: ["Admin Only"],
		security: [{ [v1BearerAuth.name]: [] }],
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

	registry.registerPath({
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
		security: [{ [v1BearerAuth.name]: [] }],
		responses: createApiResponses([unauthenticatedResponse, unauthorizedResponse]),
	});
}
