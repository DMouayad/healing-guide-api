import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "src/common/models/apiResponse";
import AppError from "src/common/models/appError";
import { ZodAppErrorSchema } from "src/common/zod/appError.zod";
import { authRequests } from "src/rest-api/auth/auth.requests";
import { authRoutes } from "src/rest-api/auth/authRouter";
import { UserSchema } from "src/rest-api/user/user.model";
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
				statusCode: StatusCodes.CONFLICT,
				description:
					"Failure: an account already exists with the same email or phone number",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.ACCOUNT_ALREADY_EXISTS()),
			},
			{
				statusCode: StatusCodes.BAD_REQUEST,
				description: "Failure: invalid signup code",
				schema: ZodAppErrorSchema,
				examples: {
					"signup code has expired": {
						value: ApiResponse.error(AppError.EXPIRED_OTP()),
					},
					"signup code is wrong": {
						value: ApiResponse.error(AppError.INVALID_OTP()),
					},
				},
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
					user: UserSchema.omit({ id: true, createdAt: true }),
				}),
			},
			{
				statusCode: StatusCodes.UNAUTHORIZED,
				description:
					"Failure: wrong login credentials, email\\phone number or password",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.WRONG_LOGIN_CREDS()),
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
	registry.registerPath({
		method: "post",
		path: authRoute + authRoutes.createSignupCode,
		description: "Used by app users to request a signup code",
		tags: ["Auth"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: authRequests.createSignupCode.body,
					},
				},
			},
		},

		responses: createApiResponses([
			{
				statusCode: StatusCodes.CREATED,
				description: "Success: a signup code was created and sent to user",
			},
			{
				statusCode: StatusCodes.CONFLICT,
				description:
					"Failure: an account already exists with provided email and\\or phone number",
				schema: ZodAppErrorSchema,
				example: ApiResponse.error(AppError.ACCOUNT_ALREADY_EXISTS()),
			},
		]),
	});
}
