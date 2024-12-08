import { userRoutes } from "@/api/user/user.router";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { ZodAppErrorSchema } from "@/common/zod/appError.zod";
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
		path: usersRoute + userRoutes.verifyEmail,
		tags: ["User"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({ code: z.string() }),
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: email was verified successfully",
			},
			{
				statusCode: StatusCodes.CONFLICT,
				description: "Failure: email already verified",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.EMAIL_ALREADY_VERIFIED()),
			},
			{
				statusCode: StatusCodes.GONE,
				description: "Failure: verification code has expired",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.EXPIRED_VERIFICATION_CODE()),
			},
			unauthenticatedResponse,
			unauthorizedResponse,
		]),
	});
	registry.registerPath({
		method: "post",
		description: "A user request a new verification code to be sent to his email",
		path: usersRoute + userRoutes.sendEmailVerification,
		tags: ["User"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({}),
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: a new code was sent to user inbox",
			},
			{
				statusCode: StatusCodes.CONFLICT,
				description: "Failure: email already verified",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.EMAIL_ALREADY_VERIFIED()),
			},
			unauthenticatedResponse,
			unauthorizedResponse,
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
