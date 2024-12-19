import { authRequests } from "@/api/auth/auth.requests";
import { authRouter, authRoutes } from "@/api/auth/authRouter";
import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { ZodAppErrorSchema } from "@/common/zod/appError.zod";
import { UserSchema } from "@/common/zod/user.zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { unauthenticatedResponse } from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";
import { v1BearerAuth } from "./openAPIDocumentGenerator";

export function registerAuthPaths(registry: OpenAPIRegistry, baseUrl: string) {
	const authRoute = `${baseUrl}/auth`;
	registry.registerPath({
		method: "post",
		path: authRoute + authRoutes.signup,
		description: "Used to register as a new app user",
		tags: ["Auth"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: authRequests.signup.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a new user was created",
				schema: z.object({
					token: z.string(),
					user: UserSchema.omit({ id: true }),
				}),
			},
			{
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				description: "Failure: unknown error has occurred",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.SIGNUP_FAILED()),
			},
			{
				statusCode: StatusCodes.CONFLICT,
				description:
					"Failure: an account already exists with the same email or phone number",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.ACCOUNT_ALREADY_EXISTS()),
			},
		]),
	});
	registry.registerPath({
		method: "post",
		path: authRoute + authRoutes.login,
		description: "Used by app users to login",
		tags: ["Auth"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: authRequests.login.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.OK,
				description: "Success: login was success",
				schema: z.object({
					token: z.string(),
				}),
			},
			{
				statusCode: StatusCodes.UNAUTHORIZED,
				description: "Failure: wrong login credentials",
				schema: ZodAppErrorSchema,
				examples: {
					"wrong email\\phone number": {
						value: ApiResponse.error(AppError.ACCOUNT_NOT_FOUND()),
					},
					"wrong password": {
						value: ApiResponse.error(AppError.WRONG_LOGIN_CREDS()),
					},
				},
			},
		]),
	});
	registry.registerPath({
		method: "post",
		path: authRoute + authRoutes.logout,
		description: "Used by app users to logout",
		tags: ["Auth"],
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
				description: "Success: user was logged out",
			},
			unauthenticatedResponse,
		]),
	});
	registry.registerPath({
		method: "post",
		path: authRoute + authRoutes.confirmIdentity,
		description: "Used by app users to confirm their identity by providing an otp",
		tags: ["Auth"],
		security: [{ [v1BearerAuth.name]: [] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: authRequests.confirmIdentity.body,
					},
				},
			},
		},
		responses: createApiResponses([
			{
				statusCode: StatusCodes.NO_CONTENT,
				description: "Success: user identity was confirmed",
			},
			{
				statusCode: StatusCodes.FORBIDDEN,
				description: "Failure: wrong otp",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.FORBIDDEN()),
			},
			{
				statusCode: StatusCodes.GONE,
				description: "Failure: otp has expired",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.EXPIRED_OTP()),
			},
			unauthenticatedResponse,
		]),
	});
}
